let file = require("../utils/import");

let points = [];
function parse(text, part=1){
    let lines = file.getSample(text).trim();
    lines = lines.split('\n');
    for (let line of lines){
        let temp = line.split(',').map(Number);
        points.push(temp);
    }
}

function buildEdges(vertices) {
	let edges = [];
	for (let i = 0; i < vertices.length; i++) {
		let [x1, y1] = vertices[i];
		let [x2, y2] = vertices[(i + 1) % vertices.length]; 
		edges.push({ x1, y1, x2, y2 });
	}
	return edges;
}

function pointOnSegment(px, py, e) {
	let { x1, y1, x2, y2 } = e;

	if (x1 === x2) {
		if (px !== x1) return false;
		let ymin = Math.min(y1, y2);
		let ymax = Math.max(y1, y2);
		return py >= ymin && py <= ymax;
	} else {
		if (py !== y1) return false;
		let xmin = Math.min(x1, x2);
		let xmax = Math.max(x1, x2);
		return px >= xmin && px <= xmax;
	}
}

function pointInOrOnPolygon(px, py, edges) {
	for (let e of edges) {
		if (pointOnSegment(px, py, e)) {
			return true;
		}
	}
	let inside = false;

	for (let e of edges) {
		let { x1, y1, x2, y2 } = e;
		if (x1 !== x2) continue; 

		let ymin = Math.min(y1, y2);
		let ymax = Math.max(y1, y2);
		if (py >= ymin && py < ymax && x1 > px) {
			inside = !inside;
		}
	}

	return inside;
}

function hvProperCross(h, v) {
	let hy = h.y1; 
	let hxMin = Math.min(h.x1, h.x2);
	let hxMax = Math.max(h.x1, h.x2);

	let vx = v.x1; 
	let vyMin = Math.min(v.y1, v.y2);
	let vyMax = Math.max(v.y1, v.y2);
	if (hy > vyMin && hy < vyMax && vx > hxMin && vx < hxMax) {
		return true;
	}
	return false;
}

function rectCrossesPolygon(rectEdges, polyEdges) {
	for (let re of rectEdges) {
		let reVertical = (re.x1 === re.x2);

		for (let pe of polyEdges) {
			let peVertical = (pe.x1 === pe.x2);
			if (reVertical === peVertical) {
				continue;
			}

			if (reVertical) {
				// rect vertical, poly horizontal -> swap roles
				if (hvProperCross(pe, re)) return true;
			} else {
				if (hvProperCross(re, pe)) return true;
			}
		}
	}
	return false;
}

function rectInsidePolygon(x1, y1, x2, y2, polyEdges) {
	let left = Math.min(x1, x2);
	let right = Math.max(x1, x2);
	let top = Math.min(y1, y2);
	let bottom = Math.max(y1, y2);

	if (left === right || top === bottom) return false;

	let corners = [
		[left, top],
		[left, bottom],
		[right, top],
		[right, bottom]
	];

	for (let [cx, cy] of corners) {
		if (!pointInOrOnPolygon(cx, cy, polyEdges)) {
			return false;
		}
	}

	let rectEdges = [
		{ x1: left,  y1: top,    x2: right, y2: top },    // top
		{ x1: left,  y1: bottom, x2: right, y2: bottom }, // bottom
		{ x1: left,  y1: top,    x2: left,  y2: bottom }, // left
		{ x1: right, y1: top,    x2: right, y2: bottom }  // right
	];

	if (rectCrossesPolygon(rectEdges, polyEdges)) {
		return false;
	}

	return true;
}

function solve(part=1) {
    let redPoints = points;
	let edges = buildEdges(redPoints);
	let maxArea = 0;
	let bestPair = null;  // [[x1,y1],[x2,y2]]
	let bestRect = null;  // 4 corners, if you want them

	for (let i = 0; i < redPoints.length; i++) {
		let [x1, y1] = redPoints[i];

		for (let j = i + 1; j < redPoints.length; j++) {
			let [x2, y2] = redPoints[j];

			// Skip line/point rectangles
			if (x1 === x2 || y1 === y2) continue;

            if(part==2){
                if (!rectInsidePolygon(x1, y1, x2, y2, edges)) {
                    continue;
                }
            }

			// Inclusive tile area (include both edges)
			let width = Math.abs(x2 - x1) + 1;
			let height = Math.abs(y2 - y1) + 1;
			let area = width * height;

			if (area > maxArea) {
				maxArea = area;
				let left = Math.min(x1, x2);
				let right = Math.max(x1, x2);
				let top = Math.min(y1, y2);
				let bottom = Math.max(y1, y2);

				bestPair = [[x1, y1], [x2, y2]];
				bestRect = [
					[left, top],
					[left, bottom],
					[right, top],
					[right, bottom]
				];
			}
		}
	}

	return maxArea + '\t-\t[' +bestPair[0]+']\tx   ['+bestPair[1]+']';
}

//parse("sample.txt");
parse("Day9.txt");

console.log(`Part 1: ${solve(1)}`);
console.log(`Part 2: ${solve(2)}`);