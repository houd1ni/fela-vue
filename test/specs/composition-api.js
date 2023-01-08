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
          }
        }
      }
    })
    const styl = renderer.styl
    const f = styl({root: {
      background: 'yellow'
    }})
    f('center root')
    const result = renderer.style
    t.snapshot(result)
  } catch(e) {
    t.fail(e.message)
  }
})