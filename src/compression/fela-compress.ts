
const rules = `
  margin margin-left display padding left top color margin-top justify-content
  border width height border-radius background bottom position align-items
  center bottom top absolute relative float right opacity z-index min-width
  margin-top margin-bottom min-height border-top border-bottom filter
  transition-duration max-height overflow transform
`.trim().split(/[, ]/g).filter(Boolean)

// TODO: use generator from wspomisify.
let i = 0

const compressRule = () => `a${i++}`

export const getDics = (pepka: Partial<typeof import('pepka')>) => {
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