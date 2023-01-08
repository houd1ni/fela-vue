import test from 'ava'
import { Renderer } from '../../dist/bundle.mjs'

test('init', async (t) => {
  try {
    const renderer = new Renderer()
    if(['mixin', 'style'].some((prop) => !(prop in renderer))) {
      throw new Error('Insufficient required props !')
    }
    t.pass()
  } catch(e) {
    t.fail(e.message)
  }
})