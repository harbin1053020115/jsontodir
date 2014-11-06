/**
 * 转换json为目录
 * @params:
 *   jsonSource Object/String
 *
 * Created by ermin.zem@alibaba-inc.com on 2014/11/6.
 */

var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var shutils = require("shutils");
var isurl = require("is-url");
var Q = require('q');
var request = require("request");
var log = require("log");

var filesystem = shutils.filesystem;
var logger = new log("INFO");

var curDir = process.cwd();

/* 入口函数 */
function main(jsonSource){
    var jsonObject;

    if(_.isObject(jsonSource)){
        // 参数直接为json对象
        jsonObject = jsonSource;
    }else{
        // 参数为字符串，认定为文件路径
        jsonObject = parseJsonFile(path.join(process.cwd(), jsonSource));
    }

    jsonToDir(jsonObject, curDir);
}

/* 解析json文件内容 */
function parseJsonFile(file){
    if (fs.existsSync(file)){
        var jsonContent = fs.readFileSync(file, "utf-8");
        jsonContent = JSON.parse(jsonContent);

        return jsonContent;
    }

    return {};
}

/* 根据json对象生成文件目录 */
function jsonToDir(jsonObject, baseDir){
    var dirPath, fileDirName, fileContent;

    _.each(jsonObject, function(value, key){
        if(value.type == "directory"){
            /* 目录 */
            dirPath = path.join(baseDir, key);
            filesystem.makedirsSync(dirPath);

            // 是否有children字段（代表有子目录/文件）
            if(value.children){
                jsonToDir(value.children, dirPath);
            }
        }else{
            /* 文件 */
            fileDirName = path.join(baseDir, key);

            if(value.content){
                if(isurl(value.content)){
                    // 远程文件
                    requestUrlContent(value.content).then(function(){
                        fileContent = arguments[0];

                        fs.writeFileSync(fileDirName, fileContent);
                    });
                }else{
                    fileContent = value.content;

                    fs.writeFileSync(fileDirName, fileContent);
                }
            }else{
                fs.writeFileSync(fileDirName, "");
            }
        }
    });
}

/* 获取远程文内容 */
function requestUrlContent(url){
    var deferred = Q.defer();

    request(url, function(error, response, body) {
        if (error) {
            logger.error(error);
            deferred.reject(error);
        } else {
            deferred.resolve(body);
        }
    });

    return deferred.promise;
}

module.exports = main;