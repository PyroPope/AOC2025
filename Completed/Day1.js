const file = require("../utils/import");
const makeKey = (...args)=>{
    return JSON.stringify(args);;
};
const getValues = (str)=>{
    return JSON.parse(str)[0];
}


//lines.split(',').map(Number);

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
    let part1 = 0;
    for (let index=0; index<data.length; index++){
        if (part==1){
            if (data[index][0]=='L'){
                start-=data[index][1];
            }
            else{
                start+=data[index][1];
            }
            start%=100;
            if(start<0) start+=100;
            if (start==0)
                part1++;
        }
        for (let i=0; i<data[index][1]; i++){
            if (data[index][0]=='L'){
                start--;
                if (start==0){
                    count++;
                }
                if (start<0){
                    start=99;
                }
            }else{
                start++;
                if (start==100){
                    count++;
                    start=0;
                }
            }
        }
    }
    if (part==1){
        return part1;
    }
    return count;
}

//parse("sample.txt");
parse("Day1.txt");

console.log(`Part 1: ${solve(1)}`);
console.log(`Part 2: ${solve(2)}`);
//console.log(`Part 2: ${solve(true)}`);