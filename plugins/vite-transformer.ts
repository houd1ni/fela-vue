import { parse, SFCDescriptor } from '@vue/compiler-sfc';
// import MagicString from 'magic-string';
import { parse as html_parse, HTMLElement, Node } from 'node-html-parser';
import { AnyObject, compose, F, flat, head, intersection, isEmpty, keys, length, qmap } from 'pepka';

type Dynamic = (cls: string, from_global: boolean, no_def: boolean, path: string) => boolean

function walk(node: Node, fn: (n: Node) => void) {
  fn(node)
  if('childNodes' in node && node.childNodes)
    for(const child of node.childNodes as any as Node[])
      walk(child, fn)
}
const import_re = /import\s*?\{\s*?([a-zA-Z\d,\s_]*?)css([a-zA-Z\d,\s_]*?)\}\s*?from\s*?['"]fela-vue['"]/
const lit_re = /\b(css`)([^`]*)`/g // Does not ignore ` in ${...}
const file_re = /\.vue$/
const style_re = /^(?:const|let)\s+(\w+)\s+=/
const classname_re = /[\b\s]\.([\w-]+) *?{/g
const classname_extended_re = /(?:^|\s+)(\!?(?:[\w-]+\.?)+)\b/g
const zero = 0, nl = '\n\r', esc = '\\', ins_open = '${', ins_close = '}', term = '`'
const is_escaped = (s: string, i: number) => {
  let cnt = zero
  while(i>zero) {
    if(s[i--]===esc) cnt++
    else break
  }
  return cnt%2
}
const get_skip = (open: string, close: string, term: string) => {
  const len_open = length(open)
  const len_close = length(close)
  const len_term = length(term)
  let j=zero, k=zero, z=zero, balance=zero
  let c: string
  return (where: string, start: number) => {
    const where_len = length(where)
    for(let i=start; i<where_len; i++) {
      c = where[i]
      switch(true) {
        case(c===open[j] && k===zero&&z===zero && !is_escaped(where, i-1)):
          j++
          if(j===len_open) { balance++; j=zero }
          break
        case(c===close[k] && j===zero&&z===zero && !is_escaped(where, i-1)):
          k++
          if(k===len_close) { balance&&balance--; k=zero }
          break
        case(c===term[z] && j===zero&&k===zero && !is_escaped(where, i-1)):
          z++
          if(z===len_term && balance===zero) return i
          break
      }
    }
    return where_len-1
  }
}
function find_blocks(script: string): string[] {
  const lits: string[] = []
  let i=zero
  const skip = get_skip(ins_open, ins_close, term)
  for(const g of script.matchAll(lit_re)) {
    const index = g.index+length(g[1])+1
    if(i>index) continue
    const end = skip(script, index)
    lits.push(script.slice(index, end))
    i=end
  }
  return lits
}
function get_classnames(block: string): string[] {
  const names: string[] = []
  for(const g of block.matchAll(classname_re)) names.push(g[1])
  return names
}
function wrap_class(style_varname: string, cls: string) { return `${style_varname}('${cls}')` }
function compile_classnames(
  classnames: string[],
  src: string, style_varname: string,
  dynamic: (cls: string) => boolean
): string {
  let out: string[] = []
  let to_fela: string[] = []
  let has_fela = false
  for(const g of src.matchAll(classname_extended_re)) {
    const cls = g[1]
    if(classnames.includes(cls) || dynamic(cls)) to_fela.push(cls)
    else {
      if(length(to_fela)) {
        out.push(wrap_class(style_varname, to_fela.join(' ')))
        to_fela.splice(zero)
        has_fela=true
      }
      out.push(`"${cls}"`)
    }
  }
  if(length(to_fela)) out.push(wrap_class(style_varname, to_fela.join(' ')))
  return has_fela ?
    length(out) ? `[${out.join(', ')}]` : head(out)
    : src
}
function get_script(vue: SFCDescriptor) {
  const no_setup = vue.scriptSetup===null
  const script = no_setup ? vue.script : vue.scriptSetup
  return {
    s: script?.content,
    setup: script ? !no_setup : false,
    pos: script?.loc
  }
}
function fela_vue_classnames(vue: SFCDescriptor): string[] {
  const {s: script} = get_script(vue)
  if(script) {
    const imports = import_re.test(script)
    if(!imports) return []
    return compose(flat, qmap(get_classnames), find_blocks)(script)
  }
  return []
}
function get_line(s: string, i: number): {line: string, pos: [number, number]} {
  const len = length(s)
  let c: string, j=i
  while(i>0 && !nl.includes(c=s[i])) i--
  while(j<len && !nl.includes(c=s[j])) j++
  return {line: s.slice(i+1, j), pos: [i+1, j]}
}
function ensure_style(vue: SFCDescriptor): string {
  const def_name = 'style'
  const {setup, s: script} = get_script(vue)
  if(script) {
    // TODO: already done here, maybe hash the results ?
    if(import_re.test(script)) {
      let line: any, need=false, name: string, g2: any, style_found=false
      for(const g of script.matchAll(lit_re)) {
        line = get_line(script, g.index)
        if(line.line.trimStart()===line.line) // Simple folding detection.
          if(!(g2=line.line.match(style_re))) {
            need=true
          } else if(!style_found) {
            if(g2[1]===def_name) style_found=true
            name=g2[1]
          }
      }
      if(need) vue['script'+(setup?'Setup':'')].content =
        script.slice(0, line.pos[0])+
        `const ${name||def_name} = `+line.line+
        script.slice(line.pos[1])
      return name||def_name
    }
  }
  return def_name
}

export interface FelaVueCSSOptions {
  dynamic: Dynamic
  globals: AnyObject
  no_style: boolean
}

export function FelaVueCSS({
  dynamic, globals, no_style = true
}: Partial<FelaVueCSSOptions> = {}) {
  const global_keys = keys(globals||{})
  return {
    name: 'transform-fela-vue-css',
    transform(src: string, id: any) {
      // const ms = new MagicString(src)
      if(file_re.test(id)) {
        try {
          const vue = parse(src).descriptor
          if(vue.template) {
            const {template} = vue
            const classnames = [...global_keys, ...fela_vue_classnames(vue)] as string[]
            const no_def = isEmpty(classnames)
            if(!no_def || dynamic) {
              const ast = html_parse(template.content)
              const style_varname = ensure_style(vue)
              for(const child of ast.childNodes)
                walk(child, node => {
                  if(node instanceof HTMLElement) {
                    const el = node
                    const cls = el.getAttribute('class')
                    if(cls) {
                      el.removeAttribute('class')
                      const classes = cls.split(/ +/g)
                      const all = length(classes)===length(intersection(classes, classnames))
                      if(all) el.setAttribute(':class', wrap_class(style_varname, cls))
                      else {
                        const res = compile_classnames(
                          classnames, cls, style_varname,
                          dynamic
                            ? (cls: string) => dynamic(cls, cls in global_keys, no_def, id)
                            : F
                        )
                        if(res!==cls) el.setAttribute(':class', res)
                      }
                    }
                  }
                })
              const code = src.slice(zero, template.loc.start.offset)+
                ast+
                src.slice(template.loc.end.offset)
              // ms.remove(0, src.length-1)
              // ms.append(code)
              const out = {
                code: code,
                map: null // ms.generateMap() // provide source map if available
              }
              if(no_style) {
                const new_vue = parse(out.code).descriptor
                const {pos} = get_script(new_vue)
                const new_code = out.code.slice(zero, pos.start.offset)+
                  get_script(vue).s+
                  out.code.slice(pos.end.offset)
                // ms.remove(0, code.length-1)
                // ms.append(new_code)
                out.code = new_code
                // out.map = ms.generateMap()
              }
              return out
            } else return { code: src, map: null /* ms.generateMap() */ }
          } else return { code: src, map: null /* ms.generateMap() */ }
        } catch (error) {
          console.error('Error in v-class-transformer:', error)
        }
      }
    }
  }
}