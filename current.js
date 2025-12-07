const file = require("./utils/import");
const makeKey = (...args)=>{
    return JSON.stringify(args);;
};
const getValues = (str)=>{
    return JSON.parse(str)[0];
}

let grid = [];
function parse(text, part=1){
    let lines = file.getSample(text).trim();
    lines = lines.split('\n');
    for (let line of lines){
        let temp = line.split('');
        grid.push(temp);
    }
}

function solve(part=1){

} 

parse("sample.txt");
//parse("input.txt");

console.log(`Part 1: ${solve(1)}`);
//console.log(`Part 2: ${solve(2)}`);