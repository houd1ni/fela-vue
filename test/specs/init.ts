import test from 'ava'
// import { Renderer } from '../../dist/bundle.esm'
const { Renderer } = require('../../dist/bundle')

test('init', (t) => {
  return new Promise(async (ff) => {
    try {
      new Renderer()
      ff(t.pass())
    } catch(e) {
      ff(t.fail())
    }
  })
})