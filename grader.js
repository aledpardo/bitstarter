#!/usr/bin/env node
var fs                 = require('fs');
var sys                = require('util');
var rest               = require('restler');
var program            = require('commander');
var cheerio            = require('cheerio');
var HTMLFILE_DEFAULT   = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT        = "http://floating-eyrie-1011.herokuapp.com/";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
    }
    return instr;
};

var assertUrlExists = function(url){
    var r;
    console.log( url );
    rest.get(url).on('complete', function(result, response) {
	r = response;
    });
    if ( url )
	return url;
    else{ 
	console.log("O");
        process.exit(1);
    }	
};

var checkUrlAddress = function(url, checksfile){
    $ = assertUrlExists( url );
    var checks = loadChecks( checksfile );
    var out = {};
    for( var ii in checks ) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile){
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for( var ii in checks ) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    //Workaround for commander.js issue.
    //http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    console.log("Modulo de teste");
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-u, --url <url_file>'     , 'Url to a web page'  , clone(assertUrlExists ), URL_DEFAULT       )
        .option('-f, --file <html_file>'   , 'Path to index.html' , clone(assertFileExists), HTMLFILE_DEFAULT  )
        .parse(process.argv);
    
    var checkJson;
    var outJson;

    console.log(123123);
    if ( program.url ) {
	rest.get(program.url).on('complete',
		function(result){
		    fs.writeFileSync("urlTest.html", result);
		    checkJson = checkHtmlFile("urlTest.html")
		})
	console.log( "URL" );
checks);
    } else if ( program.file != 'undefined' ) {
	console.log("If File");
	checkJson = checkHtmlFile(program.file, program.checks);
    }
    var outJson = JSON.stringify(checkJson, null, 4 );
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
