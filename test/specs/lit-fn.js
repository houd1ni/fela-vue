import test from 'ava'
import { css, Renderer } from '../../dist/bundle.mjs'
import { equals } from 'pepka'

test('lit-css-fn', async (t) => {
  try {
    const renderer = new Renderer({
      defStyles() {
        return {
          center: {
            display: 'flex',
            justifyContent: 'center'
          }
        }
      }
    })
    const styl = renderer.styl
    const f = styl(css`
      .red { color red }
      .fn => {
        color cyan
        font-weight [$active ? 900 : 200];
        background black
      }
    `)
    const a = f('red fn', {active: false})
    const b = f('red fn', {active: true})
    if(equals(a, b)) return t.fail('The fn output does not depend on the parameter!')
    const result = renderer.style
    t.snapshot(result)
  } catch(e) {
    t.fail(e.message)
  }
})