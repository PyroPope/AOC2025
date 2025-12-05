const file = require("./utils/import");
const makeKey = (...args)=>{
    return JSON.stringify(args);;
};
const getValues = (str)=>{
    return JSON.parse(str)[0];
}

var data = [];
function parse(text, part=1){
    let lines = file.getSample(text).trim();
    data = lines.split('\n');
}

function solve(part=1){
    return 0;
}

parse("sample.txt");
//parse("input.txt");

console.log(`Part 1: ${solve(1)}`);
//console.log(`Part 2: ${solve(2)}`);
//console.log(`Part 2: ${solve(true)}`);