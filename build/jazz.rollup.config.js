import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
// import { terser } from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
const replace = require('@rollup/plugin-replace');
// import postcss from 'rollup-plugin-postcss';

// const packageJson = require('./package.json');
import copy from 'rollup-plugin-copy'

const path = require('path');

const BUNDLE = process.env.BUNDLE === 'true';

const plugins = [
  external(),
  resolve(),
  commonjs(),
  typescript({ tsconfig: path.resolve(__dirname, '../tsconfig.json') }),
  copy({
    targets: [
      { src: 'package-lib.json', dest: 'dist', rename: 'package.json'},
      { src: 'fonts', dest: 'dist'},
      { src: 'logos', dest: 'dist'},
      { src: 'scss', dest: 'dist'}
    ]
  })
  // postcss(),
  // terser()
];

if (BUNDLE) {
  // fileDestination += '.bundle'
  // Remove last entry in external array to bundle Popper
  // external.pop()
  // delete globals['@popperjs/core']
  plugins.push(
    replace({
      'process.env.NODE_ENV': '"production"',
      preventAssignment: true
    }),
    // nodeResolve()
  )
}

export default {
  input: path.resolve(__dirname, '../ts/src/jazz-behavior.ts'),
  output: [
    {
      file: path.resolve(__dirname, '../dist/js/jazz-behavior.js'),
      format: 'umd',
      sourcemap: true,
      name: 'jazz',
      generatedCode: 'es2015'
    }
    // ,
    // {
    //   file: path.resolve(__dirname, '../dist/js/jazz-behavior.esm.js'),
    //   format: 'esm',
    //   sourcemap: true
    // }
  ],
  plugins: plugins
}
