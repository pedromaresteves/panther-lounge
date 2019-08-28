require

module.exports={
    entry: './public/js/main.js',
    output:{
        path: __dirname + '/public/js/',
        filename:'bundle.js'
    },
    watch: false
}

//to run without NPM SCRIPT - node_modules/webpack-cli/bin/cli.js