const file = require("../utils/import");

let graph = []
let memo = new Map();
let requiredNodes = {'you':1,'out':2};
const REQUIRED_MASK = 1 | 2;

function parse(text, part=1){
    let lines = file.getSample(text).trim();
    lines = lines.split('\n');
    for (let line of lines){
        let [from, to] = line.split(':');
        from = from.trim();
        let targets =  to.trim().split(/\s+/);
        graph[from] = targets;
    }
}

function countPathsFrom(node, mask = 0) {
	if (requiredNodes[node]) {
		mask |= requiredNodes[node];
	}

	if (node === 'out') {
		return mask === REQUIRED_MASK ? 1 : 0;
	}

	const key = node + '|' + mask;
	if (memo.has(key)) {
		return memo.get(key);
	}

	let total = 0;
	const neighbours = graph[node] || [];
	for (const next of neighbours) {
		total += countPathsFrom(next, mask);
	}

	memo.set(key, total);
	return total;
}

function solve(part=1){
    memo.clear();
    let start = 'you'
    if (part==1){
        requiredNodes = {'you':1,'out':2};
    }else{
        start = 'svr'
        requiredNodes = {'fft': 1,'dac': 2};
    }
    return countPathsFrom(start)
} 

parse("Day11.txt");
console.log(`Part 1: ${solve(1)}`);
console.log(`Part 2: ${solve(2)}`);