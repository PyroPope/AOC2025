const file = require("./utils/import");
const makeKey = (...args)=>{
    return JSON.stringify(args);;
};
const getValues = (str)=>{
    return JSON.parse(str)[0];
}

function parse(text, part=1){
    let lines = file.getSample(text).trim();
    lines = lines.split('\n');
}

function part1(){
    let sum = 0;
    return sum;
}

function part2(){
    let sum = 0;
    return sum;
}

parse("sample.txt");
//parse("input.txt");

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);