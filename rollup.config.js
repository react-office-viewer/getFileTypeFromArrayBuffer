var babel = require('rollup-plugin-babel');
module.exports = {
    input: './src/index.js',
    output: {
        file: './build/bundle.js',
        format: 'cjs',
    },
    plugins: [
        babel({
            exclude: 'node_modules/**' // only transpile our source code
        }),
    ],
}