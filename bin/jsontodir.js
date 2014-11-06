/**
 * jsontodir [jsonFile/jsonObject]
 * Created by ermin.zem on 2014/11/6.
 */

var _ = require('underscore');
var jsontodir = require('../index');

var args = process.argv.slice(0, 2);
args.push("jsontodir");
_.each(process.argv.slice(2), function(item) {
    args.push(item);
});
process.argv = args;
jsontodir(process.argv[process.argv.length - 1]);