import { parse } from '@vue/compiler-sfc';
import type { DefaultTreeAdapterTypes as p5 } from "parse5";
import { parseFragment, serialize } from "parse5";
import { complement, propEq, typeIs } from 'pepka';

const is_class = propEq('name', 'class')
const not_class = complement(is_class)
const isArray = typeIs('Array')

function walk(node: p5.ChildNode, fn: (n: p5.ChildNode) => void) {
  fn(node)
  if ('childNodes' in node && node.childNodes) {
    for (const child of node.childNodes) {
      walk(child, fn)
    }
  }
}

const fileRegex = /\.vue$/

export default function FelaVueCSS() {
  return {
    name: 'transform-fela-vue-css',
    transform(src: string, id: any) {
      if(fileRegex.test(id)) {
        try {
          const vue = parse(src).descriptor
          if(vue.template) {
            const {template} = vue
            const ast = parseFragment(template.content)
            for(const child of ast.childNodes)
              walk(child, node => {
                if (node.nodeName && 'attrs' in node && isArray(node.attrs)) {
                  const el = node as p5.Element
                  const cls = el.attrs.find(is_class)
                  if(cls) {
                    el.attrs = el.attrs.filter(not_class)
                    el.attrs.push({
                      name: ':class',
                      value: `style('${cls.value}')`
                    })
                  }
                }
              })
            return {
              code: src.slice(0, template.loc.start.offset)+serialize(ast)+src.slice(template.loc.end.offset),
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