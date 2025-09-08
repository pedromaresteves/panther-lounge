module.exports = {
    entry: './public/js/main.js',
    output: {
        path: __dirname + '/public/js/',
        filename: 'bundle.js'
    },
    watch: false
}

//to run without node_modules/.bin/webpack