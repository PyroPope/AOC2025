const file = require("../utils/import");
const makeKey = (...args)=>{
    return JSON.stringify(args);;
};
const getValues = (str)=>{
    return JSON.parse(str)[0];
}

var lines = [];
var data = [];
function parse(text, part=1){
    lines = file.getSample(text).trim();
    data = lines.split('\n');
}

function findLargest12(str, k){
    const n = str.length;
    let result = '';
    let start = 0;
    
    for (let i=0; i<k; i++){
        let remaining = k - i;
        let end = n - remaining;

        let maxDigit = '-1';
        let maxIndex = start;

        for (let j=start; j<=end; j++){
            let d = str[j];
            if (d > maxDigit){
                maxDigit = d;
                maxIndex = j;
                if (maxDigit == '9') 
                    break;
            }
        }
        result += maxDigit;
        start = maxIndex + 1;
        //console.log(result);
    }
    return result;
}

function solve(part=1){
    let sum = 0;
    for (let i=0; i<data.length; i++){
        sum+=Number(findLargest12(data[i], part==2?12:2));
    }
    return sum;
}

//parse("sample.txt");
parse("Day3.txt");

console.log(`Part 1: ${solve(1)}`);
console.log(`Part 2: ${solve(2)}`);
//console.log(`Part 2: ${solve(true)}`);