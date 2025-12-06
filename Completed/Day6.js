const file = require("../utils/import");
const makeKey = (...args)=>{
    return JSON.stringify(args);;
};
const getValues = (str)=>{
    return JSON.parse(str)[0];
}

var data = [];
var ops = [];
function parse(text, part=1){
    let lines = file.getSample(text).trim();
    lines = lines.split('\n');
    for (let i=0; i<lines.length; i++){
        let temp = lines[i].split(' ');
        let row = [];
        for (let j=0; j<temp.length; j++){
            if (temp[j]!=''){
                if (i==lines.length-1){
                    row.push(temp[j].trim());
                }else{
                    row.push(parseInt(temp[j]));
                }
            }
        }
        if (i==lines.length-1){
            ops = row;
        }else{
            data.push(row);
        }
    }
}

function solve1(){
    parse("Day6.txt");
    let sum = 0;
    for(let i=0; i<ops.length; i++){
        let eqSum = data[0][i];
        for (let r=1; r<data.length; r++){
            if (ops[i]=='*'){
                eqSum *= data[r][i];
            }else{
                eqSum += data[r][i];
            }
        }
        sum += eqSum;
    }
    return sum;
}

let height
let width
let grid
let lastRow
let cols = [];
let problems = [];
function parse2(text){
    let lines = file.getSample(text).split('\n');
    height = lines.length;
    width = lines[height-1].length
    grid = lines.map(l=>l.padEnd(width, " "));
    lastRow = height-1
    for (let c = 0; c<width; c++){
        let noSpaceAbove =  false;
        for(let r=0; r<lastRow; r++){
            if(grid[r][c] !== " "){
                noSpaceAbove = true;
                break;
            }
        }
        let op =  grid[lastRow][c];
        let isProblemCol = noSpaceAbove || op == "+" || op == "*"
        cols.push({idx: c, op, isProblemCol});
    }

    let current = [];
    for(let col of cols){
        if(col.isProblemCol){
            current.push(col);
        }else{
            if(current.length){
                problems.push(current);
                current  =  [];
            }
        }
    }
    if (current.length)
        problems.push(current);
}

function solve2(){
    parse2("Day6.txt");
    let sum = 0;
    for (let problem of problems){
        let op
        let opCol =  problem.find(c=>c.op == "+" || c.op == "*")
        if (!opCol){
            continue;
        }
        op =  opCol.op;
        let sortedCols = [...problem].sort((a,b)=>b.idx - a.idx);
        let numbers = [];

        for (let col of sortedCols){
            let digits =  "";
            for(let x=0; x<lastRow; x++){
                digits += grid[x][col.idx];
            }
            digits =  digits.trim();
            if (digits){
                numbers.push(Number(digits));
            }
        }
        let value = numbers[0];
        for(let i=1; i<numbers.length; i++){
            if(op == "+"){
                value += numbers[i];
            }else{
                value *= numbers[i];
            }
        }
        sum += value;
    }
    return sum;
}

console.log(`Part 1: ${solve1()}`);
console.log(`Part 2: ${solve2()}`);