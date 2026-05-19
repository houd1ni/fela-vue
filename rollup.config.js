import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript2 from 'rollup-plugin-typescript2'
import typescript from 'typescript'

const env = process.env.NODE_ENV
const build = process.env.BUILD
const dev = env==='development'
const plugins = env==='plugins'
const cjs = build==='cjs'

export default {
  input: plugins
    ? 'plugins/index.ts'
    : dev ? 'test/in-browser.ts' : 'src/main.ts',
  output: {
    file: plugins ? 'dist/plugins/plugins.mjs' : (cjs ? 'dist/bundle.cjs' : 'dist/bundle.mjs'),
    format: cjs&&!plugins ? 'cjs' : 'es',
    name: 'fela-vue'
  },
  external: dev ? [] : [
    'fela',
    'fela-dom',
    'fela-plugin-embedded',
    'fela-plugin-prefixer',
    'fela-plugin-fallback-value',
    'fela-plugin-unit',
    '@vue/compiler-sfc',
    'node-html-parser',
    'vite',
    'pepka'
  ],
  plugins: [
    resolve(),
    commonjs({ defaultIsModuleExports: false }),
    typescript2({
      typescript,
      tsconfig: "./tsconfig.json",
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: false,
          inlineSourceMap: dev,
          module: 'esnext'
        }
      }
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(env)
      }
    })
  ]
}