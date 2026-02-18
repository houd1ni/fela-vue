import { parse, SFCDescriptor } from '@vue/compiler-sfc';
import type { DefaultTreeAdapterTypes as p5, TreeAdapter } from "parse5";
import { defaultTreeAdapter, parseFragment, serialize } from 'parse5';
import { AnyObject, complement, compose, flat, head, intersection, isEmpty, keys, length, propEq, qmap, typeIs } from 'pepka';

const is_class = propEq('name', 'class')
const not_class = complement(is_class)
const isArray = typeIs('Array')
const zero = 0
const estr = ''
const empty_attr_prefix = '__empty_attr__'
const empty_attrs_re = new RegExp(`${empty_attr_prefix}(.*)=""`, 'g')

const customTreeAdapter = (src: string): TreeAdapter => ({
  ...defaultTreeAdapter,
  getTextNodeContent(textNode: p5.TextNode) {
    if(textNode.sourceCodeLocation) {
      return src.substring(
        textNode.sourceCodeLocation.startOffset,
        textNode.sourceCodeLocation.endOffset
      )
    }
    return defaultTreeAdapter.getTextNodeContent(textNode)
  },
  getChildNodes(node: p5.ParentNode) {
    const loc = node.sourceCodeLocation
    if(loc && 'startTag' in loc) {
      const tag = src.substring(
        loc.startTag.startOffset,
        loc.startTag.endOffset
      )
      // console.log({tag, node})
      if(tag.endsWith('/>')) {
        const false_children = defaultTreeAdapter.getChildNodes(node)
        const p = (node as any).parentNode
        if(p) p.childNodes?.push(...false_children)
        return []
      }
    }
    return defaultTreeAdapter.getChildNodes(node)
  },
  getTagName(e: p5.Element) {
    const loc = e.sourceCodeLocation
    if(loc && 'startTag' in loc) {
      const tag = src.substring(
        loc.startTag.startOffset,
        loc.startTag.endOffset
      )
      return tag.match(tagname_re)[1]
    }
    // console.log({e})
    return defaultTreeAdapter.getTagName(e)
  },
  getAttrList(e: p5.Element) {
    const attrs = defaultTreeAdapter.getAttrList(e)
    for(const i in attrs) {
      const a = attrs[i]
      if(a.name.startsWith('v-') && a.value===estr) {
        const loc = e.sourceCodeLocation
        if(loc && 'startTag' in loc) {
          const {startOffset, endOffset} = loc.attrs[a.name]
          const str = src.substring(startOffset, endOffset)
          // console.dir({name: a.name, tag, loc: loc.attrs[a.name]}, {depth: 7})
          if(!str.includes('=')) a.name = empty_attr_prefix+a.name
        }
      }
    }
    return attrs
  }
})
const replace_prefixed = (tmpl: string): string =>
  tmpl.replace(empty_attrs_re, '$1')
function walk(node: p5.ChildNode, fn: (n: p5.ChildNode) => void) {
  fn(node)
  if('childNodes' in node && node.childNodes) {
    for(const child of node.childNodes) {
      walk(child, fn)
    }
  }
}
const import_re = /import\s*?\{\s*?([a-zA-Z\d,\s_]*?)css([a-zA-Z\d,\s_]*?)\}\s*?from\s*?['"]fela-vue['"]/
const lit_re = /\b(css`)([^`]*)`/g // Does not ignore ` in ${...}
const file_re = /\.vue$/
const classname_re = /[\b\s]\.([\w-]+) *?{/g
const classname_extended_re = /(?:^|\s+)(\!?(?:[\w-]+\.?)+)\b/g
const tagname_re = /<([\w-]+)\b/
const esc = '\\', ins_open = '${', ins_close = '}', term = '`'
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
function wrap_class(cls: string) { return `style('${cls}')` }
function compile_classnames(classnames: string[], src: string): string {
  let out: string[] = []
  let to_fela: string[] = []
  for(const g of src.matchAll(classname_extended_re)) {
    const cls = g[1]
    if(classnames.includes(cls)) to_fela.push(cls)
    else {
      if(length(to_fela)) out.push(wrap_class(to_fela.join(' ')))
      out.push(`"${cls}"`)
      to_fela.splice(zero)
    }
  }
  if(length(to_fela)) out.push(wrap_class(to_fela.join(' ')))
  return length(out) ? `[${out.join(', ')}]` : head(out)
}

function fela_vue_classnames(vue: SFCDescriptor): string[] {
  const script = (vue.scriptSetup===null ? vue.script : vue.scriptSetup)?.content
  if(script) {
    const imports = import_re.test(script)||true
    if(!imports) return []
    return compose(flat, qmap(get_classnames), find_blocks)(script)
  }
  return []
}


// TODO: Other options how to enable class parsing ?
export function FelaVueCSS(globals: AnyObject = {}) {
  const global_keys = keys(globals)
  return {
    name: 'transform-fela-vue-css',
    transform(src: string, id: any) {
      if(file_re.test(id)) {
        try {
          const vue = parse(src).descriptor
          if(vue.template) {
            const {template} = vue
            const ast = parseFragment(template.content, {sourceCodeLocationInfo: true})
            const classnames = [...global_keys, ...fela_vue_classnames(vue)] as string[]
            if(!isEmpty(classnames))
              for(const child of ast.childNodes)
                walk(child, node => {
                  if (node.nodeName && 'attrs' in node && isArray(node.attrs)) {
                    const el = node as p5.Element
                    const cls = el.attrs.find(is_class)
                    if(cls) {
                      el.attrs = el.attrs.filter(not_class)
                      const classes = cls.value.split(/ +/g)
                      const all = length(classes)===length(intersection(classes, classnames))
                      // console.log({classes, classnames})
                      el.attrs.push({
                        name: ':class',
                        value: all
                          ? wrap_class(cls.value)
                          : compile_classnames(classnames, cls.value)
                      })
                    }
                  }
                })
                // console.dir(ast, {depth: 12})
                // console.log('AAAAA', replace_prefixed(serialize(ast, {treeAdapter: customTreeAdapter(template.content)})))
            return {
              code: src.slice(zero, template.loc.start.offset)+
                replace_prefixed(serialize(ast, {treeAdapter: customTreeAdapter(template.content)}))+
                src.slice(template.loc.end.offset),
              map: null // provide source map if available
            }
          }
        } catch (error) {
          console.error('Error in v-class-transformer:', error)
        }
      }
    }
  }
}