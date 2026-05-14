const path = require('path');

module.exports = {
    mode: 'development', // Better for debugging
    entry: {
        main: './public/js/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].bundle.js'
    },
    watch: false,
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
    }
};

//to run without node_modules/.bin/webpack