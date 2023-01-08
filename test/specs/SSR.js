import test from 'ava'
import { Renderer } from '../../dist/bundle.mjs'

test('SSR', async (t) => {
  const renderer = new Renderer({ ssr: true })
  renderer.mixin.methods.f({ color: 'red' })
  const style = renderer.style
  if(style.includes('red')) {
    t.pass()
  } else {
    // Just to look inside.
    t.is(style, '10px')
  }
})