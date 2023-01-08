
const rules = `
top flex grid overflow transform transition-duration max-height
margin margin-top margin-left margin-bottom margin-right justify-content
border width height border-radius background bottom position align-items
center bottom absolute relative float right opacity z-index min-width
min-height border-top border-bottom filter fixed left color space-between
font-weight font-size none hidden auto display block inline inline-block
padding padding-top padding-bottom paddin-left padding-right
`.replace(/\s+/g, ',').split(/[, ]/g).filter(Boolean)

// TODO: use generator from wspomisify. Then maybe add 100% into rules.
let i = 0

const compressRule = () => `a${i++}`

export const getDics = (pepka: Partial<typeof import('pepka')>) => {
  i = 0
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