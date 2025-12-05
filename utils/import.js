const fs = require("fs");
require('dotenv').config()
var request = require('sync-request');
function getTextURL(int, year=2024){
    let res = request('GET', `https://adventofcode.com/${year}/day/${int}/input`, { 
        headers: {
            'Content-Type': 'text/plain',
            Cookie: `session=${process.env.TOKEN}`,
            'User-Agent': `${process.env.USER}`
        }
    });
    return res.body.toString().trimEnd();
}

function getText(filename){
    if(filename.indexOf(".txt")<0 && filename.indexOf(".js")<0){
        filename+=".txt";
    }
    let old = filename;
    if(fs.existsSync(filename)){
        return fs.readFileSync(filename).toString('utf-8').replaceAll('\r\n','\n');
    }else{
        filename = './'+old;
        if(fs.existsSync(filename)){
            return fs.readFileSync(filename).toString('utf-8').replaceAll('\r\n','\n');
        }
        filename = './Completed/'+old;
        if(fs.existsSync(filename)){
            return fs.readFileSync(filename).toString('utf-8').replaceAll('\r\n','\n');
        }
    }
    return "Unable to load file.";
}

exports.getSample = getText;
exports.getInput = getTextURL;