import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import svgo from 'rollup-plugin-svgo';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
plugins: [
    resolve(),
    commonjs({
      namedExports: {
        "node_modules/react-sizeme/dist/react-sizeme.js": ["SizeMe"],
      }
    }),
    typescript({
      typescript: require('typescript'),
      exclude: [],
    }),
    postcss({
      modules: true,
      namedExports: true
    }),
    svgo(),
  ],
}