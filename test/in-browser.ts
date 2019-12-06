import { css } from '../src/css-lit'
import { Renderer } from '../src/main'


;(window as any).css = css
;(window as any).renderer = new Renderer()
