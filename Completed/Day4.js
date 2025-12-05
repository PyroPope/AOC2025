const file = require("./utils/import");
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
    lines = lines.split('\n');
    for (let i=0; i<lines.length; i++){
        data.push(lines[i].split(''));
    }
}

function countAdjacent(x,y, board){
    let deltas = [-1,0,1];
    let count = 0;
    for (let dx of deltas){
        for (let dy of deltas){
            if (dx===0 && dy===0) continue;
            let nx = x+dx;
            let ny = y+dy;
            if (nx<0 || ny<0 || nx>=board[0].length || ny>=board.length) continue;
            if (board[ny][nx]==='@'){
                count++;
            }
        }
    }
    return count;
}

function solve(part=1){
    let copy = JSON.parse(JSON.stringify(data));
    let sum = 0;
    for (let y=0; y<data.length; y++){
        for (let x=0; x<data[0].length; x++){
            if (data[y][x]==='@'){
                let adjacent = countAdjacent(x,y,data);
                if (adjacent<4){
                    sum++;
                    copy[y][x] = '.';
                }
            }
        }
    }
    if (part==1)
        return sum;
    let board =  JSON.parse(JSON.stringify(copy));
    while (true){
        let change = 0;
        copy = JSON.parse(JSON.stringify(board));
        for (let y=0; y<board.length; y++){
            for (let x=0; x<board[0].length; x++){
                if (board[y][x]==='@'){
                    let adjacent = countAdjacent(x,y,board);
                    if (adjacent<4){
                        change++;
                        copy[y][x] = '.';
                    }
                }
            }
        }
        sum += change;
        if (change==0){
            break;
        }
        board = JSON.parse(JSON.stringify(copy));
    }
    return sum;
}

//parse("sample.txt");
parse("input.txt");

console.log(`Part 1: ${solve(1)}`);
console.log(`Part 2: ${solve(2)}`);
//console.log(`Part 2: ${solve(true)}`);