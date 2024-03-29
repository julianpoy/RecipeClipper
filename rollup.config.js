import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import pkg from './package.json' assert { type: "json" };

export default [{
  input: 'src/index.js',
  output: [
    {
      name: 'RecipeClipper',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
    },
    {
      name: 'RecipeClipper',
      file: pkg.iife,
      format: 'iife',
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    babel()
  ],
}];
