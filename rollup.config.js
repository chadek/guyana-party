import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    file: './dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**'
    }),
    terser()
  ]
}
