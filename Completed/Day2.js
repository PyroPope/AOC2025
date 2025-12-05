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
    lines = lines.split(',');
    for (let i=0; i<lines.length; i++){
        data.push([Number(lines[i].split('-')[0]), Number(lines[i].split('-')[1])]);
    }
}

function solve(part=1){
    let count = 0;
    let count2 = 0;
    let seen = new Set()
    for(let i=0; i<data.length; i++){
        let start = data[i][0];
        let end = data[i][1];
        for(let j=start; j<=end; j++){
            let str = ''+j;
            let comp = '';
            for(let k=0; k<str.length; k++){
                if (seen.has(str))
                    break;
                comp += str[k];
                //console.log(comp, str.substring(k+1))
                if (comp == str.substring(k+1)){
                    seen.add(str);
                    count+= Number(str);
                    break;
                }
                if(comp.length <= str.length/3){
                    let regex = new RegExp(`^(?:${comp})+$`);
                    if(regex.test(str)){
                        if (str.length / comp.length >2){
                            count2 += Number(str);
                            seen.add(str);
                            break;
                        }
                    }
                }
            }
        }
    }
    if (part==2)
        return count+count2;
    return count;
}

parse("Day2.txt");
//parse("input.txt");

console.log(`Part 1: ${solve(1)}`);
console.log(`Part 2: ${solve(2)}`);
//console.log(`Part 2: ${solve(true)}`);