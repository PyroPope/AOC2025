const file = require("../utils/import");

var lines = [];
var data = [];
function parse(text, part=1){
    lines = file.getSample(text).trim();
    lines = lines.split('\n');
    for (let i=0; i<lines.length; i++){
        if (lines[i][0]=='L'){
            data.push(['L',Number(lines[i].substring(1))]);
        }else{
            data.push(['R',Number(lines[i].substring(1))]);
        }
    }
}

function solve(part=1){
    let start = 50;
    let count = 0;
    for (let index=0; index<data.length; index++){
        for (let i=0; i<data[index][1]; i++){
            if (data[index][0]=='L'){
                start--;
                if (start<0){
                    start=99;
                }
            }else{
                start++;
                if (start==100){
                    start=0;
                }
            }
            if (start==0 && part==2)
                count++;
        }
        if(start==0 && part==1)
            count++;
    }
    return count;
}

parse("Day1.txt");

console.log(`Part 1: ${solve(1)}`);
console.log(`Part 2: ${solve(2)}`);