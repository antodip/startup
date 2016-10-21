var Options = require('obfuscator').Options;
var obfuscator = require('obfuscator').obfuscator;
var fs = require('fs');
var glob = require("glob")


var fileList = [];


glob("server/**/*.js",  function (er, files) {

    //var options = new Options(['index.js', 'server/data-acquirer/data-acquirer.js'], '.', 'index.js', true);
    files.push("index.js")
    var options = new Options(files, '.', 'index.js', true);

    // custom compression options
    // see https://github.com/mishoo/UglifyJS2/#compressor-options
    options.compressor = {
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: false,
        hoist_funs: false
    };

    obfuscator(options, function (err, obfuscated) {
        if (err) {
            throw err;
        }
        fs.writeFile('./dist/server.js', obfuscated, function (err) {
            if (err) {
                throw err;
            }

            console.log('created server.js');
        });
    });

})


