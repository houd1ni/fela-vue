
- Cache the functions somewhere in the Renderer to avoid recreation!


// FIXME: Does not work!
// .big, .thumb {
//   background-repeat no-repeat
//   background-position center center
//   background-size contain
// }
// .big {
//   width 100%
//   height calc(100% - 250px)
//   border 2px solid #4b6177
//   background-image url("${big.value}")
// }
// .thumbs {
//   margin-top 1
//   gap 1
// }
// .thumb => {
//   width 6; height 6
//   background-image url("[$pic]")
// }

0.3ms per time:
console.time('shit')
for(let i=0; i<1e4; i++) css`
  .root {
    z-index 2
    background white
    padding 1
    box-shadow 0 2px 6px #dadada
  }
  .header {
    padding-bottom .75
    border-bottom 1px solid #ddd
  }
  .chevron {
    max-width 3; max-height 3
    padding .4
    :hover { background #f2f9f5 }
    :active { background #edf6f2 }
    &>svg { width 100%; height 100% }
  }
  .toggles {
    gap 1
    align-items center
    padding-bottom 1px
  }
  .toggle-month, .toggle-year {
    :hover { background #f2f9f5 }
  }
  .month {
    min-width 20
    min-height 18
  }
  .year {
    min-width 20
    min-height 18
  }
  .month-grid, .year-grid {
    display grid
    grid-template-columns repeat(7, 1fr)
    gap 2px
    margin-top 4px
  }
  .weekday {
    text-align center
    font-size .75rem
    color #666
    padding 4px 0
  }
  .day-cell {
    aspect-ratio 1
    padding 2px
    border-radius 4px
    :hover { background #f2f9f5 }
    :active { background #edf6f2 }
  }
  .day-number {
    font-size .875rem
    font-weight 500
  }
  .day-pale { opacity .3 }
  .month-cell {
    aspect-ratio 1
    display flex
    align-items center
    justify-content center
    padding 2px
    border-radius 4px
    :hover { background #f2f9f5 }
    :active { background #edf6f2 }
  }
  .month-name {
    font-size .875rem
    font-weight 500
  }
  .month-selected {
    background #e6f2ff
    font-weight bold
  }
  .year-cell {
    aspect-ratio 1
    display flex
    align-items center
    justify-content center
    padding 2px
    border-radius 4px
    :hover { background #f2f9f5 }
    :active { background #edf6f2 }
  }
  .year-number {
    font-size .875rem
    font-weight 500
  }
  .year-selected {
    background #e6f2ff
    font-weight bold
  }
`
console.timeEnd('shit')