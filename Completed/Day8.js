let file = require("../utils/import");
let makeKey = (...args)=>{
    return JSON.stringify(args);;
};
let getValues = (str)=>{
    return JSON.parse(str)[0];
}

let points = [];
let K =  1000;
function parse(text, size=1000){
    K = size;
    let lines = file.getSample(text).trim();
    lines = lines.split('\n');
    for (let line of lines){
        let [x,y,z] = line.split(',').map(Number);
        points.push([x,y,z]);
    }
}

function dist2(a,b){
    let dx = a[0] - b[0];
    let dy = a[1] - b[1];
    let dz = a[2] - b[2];
    return dx * dx + dy*dy + dz*dz
}

class UnionFind {
	constructor(size) {
		this.parent = new Array(size);
		this.sz = new Array(size);
		for (let i = 0; i < size; i++) {
			this.parent[i] = i;
			this.sz[i] = 1;
		}
	}

	find(x) {
		if (this.parent[x] !== x) {
			this.parent[x] = this.find(this.parent[x]);
		}
		return this.parent[x];
	}

	union(a, b) {
		let ra = this.find(a);
		let rb = this.find(b);
		if (ra === rb) return false; // already in same circuit

		// Union by size
		if (this.sz[ra] < this.sz[rb]) {
			[ra, rb] = [rb, ra];
		}
		this.parent[rb] = ra;
		this.sz[ra] += this.sz[rb];
		return true;
	}
}

function solve(part=1){
    let n = points.length;
    let edges = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            let d2 = dist2(points[i], points[j]);
            edges.push({ d2, i, j });
        }
    }

    edges.sort((a, b) => a.d2 - b.d2);

    const uf = new UnionFind(n);

    if(part == 1){
        let limit = Math.min(K, edges.length);
        for (let k = 0; k < limit; k++) {
            let { i, j } = edges[k];
            uf.union(i, j); // if same circuit already
        }

        let rootSizeMap = new Map();
        for (let i = 0; i < n; i++) {
            let r = uf.find(i);
            if (!rootSizeMap.has(r)) {
                rootSizeMap.set(r, uf.sz[r]);
            }
        }

        let sizes = Array.from(rootSizeMap.values()).sort((a, b) => b - a);

        while (sizes.length < 3) {
            sizes.push(1);
        }
        console.log (sizes);
        return sizes[0] * sizes[1] * sizes[2];
    }
    let componentsRemaining = n;

    let finalEdge = null;

    for (let { d2, i, j } of edges) {
        if (uf.union(i, j)) {
            componentsRemaining--;
            if (componentsRemaining === 1) {
                finalEdge = { i, j, d2 };
                break;
            }
        }
    }

    if (!finalEdge) {
        console.log("Graph never became fully connected (unexpected).");
        process.exit(0);
    }

    let x1 = points[finalEdge.i][0];
    let x2 = points[finalEdge.j][0];
    return x1 * x2
} 

//parse("sample.txt",10);
parse("Day8.txt", 1000);

console.log(`Part 1: ${solve(1)}`);
console.log(`Part 2: ${solve(2)}`);