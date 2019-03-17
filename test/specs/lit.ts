import test from 'ava'
// import { Renderer } from '../../dist/bundle.esm'
const { Renderer, css } = require('../../dist/bundle')
const fs = require('fs').promises

test('init', (t) => {
  return new Promise(async (ff) => {
    try {
      const renderer = new Renderer({ ssr: true })
      const value = 40
      const rule = () => css`
        margin: some-shit;
        padding some-shit; those: shiii
        margin-left: ${value}
        margin-right: 10px
        >*:first-of-type {
          shit 66
        }
      `
      renderer.mixin.methods.f(rule)
      if(renderer.style.includes('10px')) {
        ff(t.pass())
      } else {
        // Just to look inside.
        ff(t.is(renderer.style, '10px'))
      }
      ff(t.pass())
    } catch(e) {
      ff(t.fail())
    }
  })
})