import test from 'ava'
const { Renderer } = require('../../dist/bundle')

test('SSR', (t) => {
  return new Promise(async (ff) => {
    const renderer = new Renderer({ ssr: true })
    renderer.mixin.methods.f({ color: 'red' })
    const style = renderer.style
    if(style.includes('.a{color:red}')) {
      ff(t.pass())
    } else {
      // Just to look inside.
      ff(t.is(style, 'asd'))
    }
  })
})