import pkg from './package.json'
import ts from '@rollup/plugin-typescript'

export default {
  input: './src/index.ts',
  output: [
    {
      format: "cjs",
      file: pkg.main,
      sourcemap: true,
    },
    {
      format: "es",
      file: pkg.module,
      sourcemap: true,
    },
  ],
  plugins: [ts()]
}