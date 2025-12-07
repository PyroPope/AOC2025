const file = require("../utils/import");
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
    let rows = grid.length;
    let startC = grid[0].indexOf('S');
    let beams = new Map()
    beams.set(startC, 1);
    let count = 0;
    for (let r=1; r<rows - 1; r++){
        let nextBeams = new Map();
        for (let [col, ways] of beams.entries()){
            if (grid[r+1][col]=='^'){
                nextBeams.set(col-1, (nextBeams.get(col-1) || 0) + ways)
                nextBeams.set(col+1, (nextBeams.get(col+1) || 0) + ways)
                count++;
            }else{
                nextBeams.set(col, (nextBeams.get(col)||0) + ways);
            }
        }
        beams = nextBeams;
    }
    if (part==1)
        return count;
    let total = 0;
    for (let ways of beams.values()){
        total += ways;
    }
    return total;
} 

//parse("sample.txt");
parse("Day7.txt");

console.log(`Part 1: ${solve(1)}`);
console.log(`Part 2: ${solve(2)}`);