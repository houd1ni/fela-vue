import test from 'ava'
import { Renderer } from '../../dist/bundle.mjs'

test('composition-api', async (t) => {
  try {
    const renderer = new Renderer({
      defStyles() {
        return {
          center: {
            display: 'flex',
            justifyContent: 'center'
          },
          column: {
            display: 'flex',
            flexDirection: 'column'
          },
          spaced: {
            display: 'flex',
            justifyContent: 'space-between'
          }
        }
      },
      modifiers: {
        cen: () => true,
        sp: () => false,
      }
    })
    const styl = renderer.styl
    const f = styl({root: {
      background: 'yellow'
    }})
    f('cen.!sp&center sp.spaced column root')
    const result = renderer.style
    t.snapshot(result)
  } catch(e) {
    t.fail(e.message)
  }
})