import test from 'ava'
// import { Renderer } from '../../dist/bundle.esm'
const { Renderer } = require('../../dist/bundle')

test('init', (t) => {
  return new Promise(async (ff) => {
    try {
      const renderer = new Renderer()
      if(['mixin', 'style'].some((prop) => !(prop in renderer))) {
        throw new Error('Insufficient required props !')
      }
      ff(t.pass())
    } catch(e) {
      ff(t.fail(e.message))
    }
  })
})