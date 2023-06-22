import { zipnum } from 'zipnum'

const rules = `
top flex grid overflow transform transition-duration max-height 100%
margin margin-top margin-left margin-bottom margin-right justify-content
border width height left border-radius background bottom position align-items
center bottom absolute relative float right opacity z-index min-width
min-height border-top border-bottom border-left border-right filter
font-family font-size font-weight none hidden auto display block inline inline-block
padding padding-top padding-bottom padding-left padding-right text-align
flex-direction column box-shadow rotate content text-decoration max-width
fixed color space-between overflow-x overflow-y background-size
`.replace(/\s+/g, ',').split(/[, ]/g).filter(Boolean)

const prepareCompressRule = () => {let i=0; return () => `a${zipnum(i++)}`}

export const getDics = (pepka: Partial<typeof import('pepka')>) => {
  const compressRule = prepareCompressRule()
  const { compose, fromPairs, map, reverse, toPairs } = pepka
  const dic = compose(
    fromPairs,
    map((rule) => [rule, compressRule()])
  )(rules)
  const dicRev = compose(
    fromPairs,
    map(reverse),
    toPairs
  )(dic)
  return { dic, dicRev }
}