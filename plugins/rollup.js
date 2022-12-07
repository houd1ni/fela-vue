// The stub.
// import { } from 'ramda'
import { parseLiterals } from 'parse-literals'

export default (options = {}) => {
  // const { } = options
  return {
    name: 'fela-vue-packer',
    async transform(code, id) {
      for (const template of parseLiterals(code)) { 
        // Check if it's a css`` tagged literal
        if(template.tag.toLowerCase().includes('css')) {
          const css = template.parts.map(part => part.text).join('/* JS-EXPRESSION */')
          const result = await processor.process(plugins, css)
          const resultParts = result.css.split('/* JS-EXPRESSION */')
          for (let i = template.parts.length - 1; i > -1; i--) {
            const part = template.parts[i]
            code = code.substring(0, part.start) +
              resultParts[i] +
              code.substring(part.end)
          }
        }
      }
    }
  }
}