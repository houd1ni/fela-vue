import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'
import typescript from 'typescript'
import typescript2 from 'rollup-plugin-typescript2'

export default {
  input: process.env.NODE_ENV=='development' ? 'test/in-browser.ts' : 'src/main.ts',
  output: {
    file: process.env.BUILD == 'cjs' ? 'dist/bundle.cjs' : 'dist/bundle.mjs',
    format: process.env.BUILD == 'cjs' ? 'cjs' : 'es',
    name: 'fela-vue'
  },
  external: process.env.NODE_ENV=='development' ? [] : [
    'fela',
    'fela-dom',
    'fela-plugin-embedded',
    'fela-plugin-prefixer',
    'fela-plugin-fallback-value',
    'fela-plugin-unit',
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
          inlineSourceMap: process.env.NODE_ENV=='development',
          module: 'esnext'
        }
      }
    }),
    process.env.NODE_ENV!='development' && terser(),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
}