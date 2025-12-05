const file = require("../utils/import");
const makeKey = (...args)=>{
    return JSON.stringify(args);;
};
const getValues = (str)=>{
    return JSON.parse(str)[0];
}

var lines = [];
var freshIds = [];
var produce = [];
function parse(text, part=1){
    lines = file.getSample(text).trim();
    lines = lines.split('\n\n');
    let ranges =  lines[0].split('\n');
    produce = lines[1].split('\n').map(Number);
    for (let i=0; i<ranges.length; i++){
        let min = Number(ranges[i].split('-')[0]);
        let max = Number(ranges[i].split('-')[1]);
        freshIds.push([min, max]);
    }
}

function solve(part=1){
    let count = 0;
    if (part === 1){
        for (let i=0; i<produce.length; i++){
            let id = produce[i];
            let valid = false;
            for (let j=0; j<freshIds.length; j++){
                if (id >= freshIds[j][0] && id <= freshIds[j][1]){
                    valid = true;
                    count++;
                    break;
                }
            }
        }
        return count;
    }
    freshIds = freshIds.sort((a,b)=>a[0]-b[0]);
    let [curStart, curEnd] = freshIds[0];
    for (let i=1; i<freshIds.length; i++){
        let [start, end] = freshIds[i];
        if (start <= curEnd + 1){
            curEnd = Math.max(curEnd, end);
        }else{
            count += (curEnd - curStart + 1);
            curStart = start;
            curEnd = end;
        }
    }
    return count + (curEnd - curStart + 1);
}

//parse("sample.txt");
parse("input.txt");

console.log(`Part 1: ${solve(1)}`);
console.log(`Part 2: ${solve(2)}`);
//console.log(`Part 2: ${solve(true)}`);