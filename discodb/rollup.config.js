import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-node-polyfills'

const extensions = ['.js', '.ts' ];

// export default  {
//   input: './index.js',
//   output: [
//     {
//       file: 'lib/bundles/bundle.esm.js',
//       format: 'esm',
//       sourcemap: true
//     },
//     {
//       file: 'lib/bundles/bundle.esm.min.js',
//       format: 'esm',
//       plugins: [terser()],
//       sourcemap: true
//     },
//     {
//       file: 'lib/bundles/bundle.umd.js',
//       format: 'umd',
//       name: 'myLibrary',
//       sourcemap: true
//     },
//     {
//       file: 'lib/bundles/bundle.umd.min.js',
//       format: 'umd',
//       name: 'myLibrary',
//       plugins: [terser()],
//       sourcemap: true
//     }
//   ],
//   plugins: [
//     resolve({ extensions }),
//     babel({ babelHelpers: 'bundled', include: ['src/**/*.ts'], extensions, exclude: './node_modules/**'})
//   ]
// }

export default  {
  input: './discoFunctions/swCacheSite-indexedDB.js',
  output: [
    {
      file: 'lib/bundles/sw.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'lib/bundles/sw.esm.min.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true
    },
    {
      file: 'lib/bundles/sw.umd.js',
      format: 'umd',
      name: 'myLibrary',
      sourcemap: true
    },
    {
      file: 'lib/bundles/sw.umd.min.js',
      format: 'umd',
      name: 'myLibrary',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    resolve({ extensions }),
    babel({ babelHelpers: 'bundled', include: ['src/**/*.ts'], extensions, exclude: './node_modules/**'}),
    commonjs({transformMixedEsModules: true}),
    nodePolyfills()
  ]
}