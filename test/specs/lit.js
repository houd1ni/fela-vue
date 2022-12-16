import test from 'ava'
import { css } from '../../dist/bundle.esm.js'

test('lit-css', (t) => {
  try {
    const value = 40
    const obj = {
      empty: {},
      margin: 'some-shit',
      padding: 'some-shit',
      those: 'shiii',
      marginTop: 0,
      marginLeft: 40,
      marginRight: '10px',
      '>*:first-of-type': {
        shit: 66,
        '& .inner': {
          left: 42
        }
      },
      cls: {
        color: 'yellow',
        background: 'url("data:image/gif;base64,R0lGO")',
        '& .red': {
          padding: 5,
          '& .one': {
            margin: 5,
            padding: 15
          },
          '& .two': {
            margin: 5
          }
        },
        '& .green': {
          padding: 5,
          '& .one': {
            margin: 5,
            padding: 15
          },
          '& .two': {
            margin: 5
          }
        },
        ':before': {
          content: '\'\'',
          position: 'absolute',
          borderWidth: 0
        },
        ':after': {
          content: '\'\'',
          display: 'block',
          alignItems: 'center'
        }
      },
      grandpa: {
        position: 'flex',
        margin: 0
      },
      pa: {
        position: 'flex',
        margin: 0,
        left: 1
      },
      misc: {
        float: 'right',
        width: '100%',
        left: 11
      },
      son: {
        position: 'flex',
        margin: 0,
        left: 11,
        float: 'right',
        width: '100%',
        top: 42
      }
    }
    const rule = () => css`
      .empty {}
      margin: some-shit;
      margin-top: 0  // This falsy should be kept.
      padding some-shit; those: shiii
      margin-left: ${value}
      margin-right: 10px /*
        some block comment
      */
      >*:first-of-type {
        shit 66
        .inner {
          left: 42
        }
      }
      .cls {
        .red, .green: {
          padding: 5
          // margin: 7px 5px
          .one, .two {
            margin: 5
          }
          .one {
            padding: 15
          }
        }
      }
      .cls {
        margin ${null};  // Should omit.
        color yellow
        background url("data:image/gif;base64,R0lGO")
      }
      .cls {
        :before {
          content: '';
          position: absolute;
          border-width: 0;
        }
        :after {
          content: '';
          display: block;
        }
      }
      .cls:after {
        align-items: center;
      }
      .grandpa {
        position flex
        margin 0
      }
      .pa {
        ...grandpa
        left 1
      }
      .misc {
        float right
        width 100%
        left 11
      }
      .son {
        ...pa
        ...misc
        ...nonexistent
        top 42
      }
    `

    t.deepEqual(obj, rule())
  } catch(e) {
    t.fail(e)
  }
})