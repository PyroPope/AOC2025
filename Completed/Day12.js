let file = require("../utils/import");

let shapes = []

let grids = []
function parse(text, part=1){
    let lines = file.getSample(text).trim();
    lines = lines.split('\n\n');
    shapes = [];
    for(let i=0; i<lines.length-1; i++){
        let line = lines[i].split(':\n');
        shapes.push(line[1].split('\n'));
    }
    let input = lines[lines.length-1].split('\n')
    for (let line of input){
        let [size, indexes] = line.split(': ');
        size = size.split('x').map(Number);
        indexes = indexes.split(' ').map(Number);
        grids.push({size, indexes});
    }
}

function trimShape(grid) {
	let h = grid.length;
	let w = grid[0].length;

	let top = h,
		bottom = -1,
		left = w,
		right = -1;

	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			if (grid[y][x] === "#") {
				if (y < top) top = y;
				if (y > bottom) bottom = y;
				if (x < left) left = x;
				if (x > right) right = x;
			}
		}
	}

	let out = [];
	for (let y = top; y <= bottom; y++) {
		out.push(grid[y].slice(left, right + 1));
	}
	return out;
}

function rotate90(grid) {
	let h = grid.length;
	let w = grid[0].length;
	let out = [];
	for (let x = 0; x < w; x++) {
		let row = "";
		for (let y = h - 1; y >= 0; y--) {
			row += grid[y][x];
		}
		out.push(row);
	}
	return out;
}

function flipH(grid) {
	return grid.map((row) => row.split("").reverse().join(""));
}

function generateOrientations(grid) {
	let base = trimShape(grid);
	let seen = new Set();
	let result = [];

	function add(g) {
		g = trimShape(g);
		let key = g.join("\n");
		if (!seen.has(key)) {
			seen.add(key);
			result.push(g);
		}
	}

	let originals = [base, flipH(base)];
	for (let g0 of originals) {
		let g = g0;
		for (let r = 0; r < 4; r++) {
			add(g);
			g = rotate90(g);
		}
	}

	return result;
}

function canSolveGrid(grid, shapeVariants, shapeAreas) {
	let [W, H] = grid.size;
	let rawIdx = grid.indexes;

	let counts = new Array(shapeAreas.length).fill(0);
	for (let i = 0; i < counts.length; i++) {
		counts[i] = rawIdx[i] || 0;
	}

	let totalCells = W * H;
	let totalAreaRequired = 0;
	for (let i = 0; i < shapeAreas.length; i++) {
		totalAreaRequired += shapeAreas[i] * counts[i];
	}
	if (totalAreaRequired > totalCells) return false;

	let placementsByShape = shapeVariants.map((variants, i) => {
		let placements = [];
		if (counts[i] <= 0) return placements;

		for (let pattern of variants) {
			let ph = pattern.length;
			let pw = pattern[0].length;

			if (pw > W || ph > H) continue;

			for (let y = 0; y <= H - ph; y++) {
				for (let x = 0; x <= W - pw; x++) {
					let cells = [];
					for (let dy = 0; dy < ph; dy++) {
						let row = pattern[dy];
						for (let dx = 0; dx < pw; dx++) {
							if (row[dx] === "#") {
								let gx = x + dx;
								let gy = y + dy;
								cells.push(gy * W + gx);
							}
						}
					}
					placements.push(cells);
				}
			}
		}
		return placements;
	});

	for (let i = 0; i < counts.length; i++) {
		if (counts[i] > 0 && placementsByShape[i].length === 0) {
			return false;
		}
	}

	let occupied = new Uint8Array(totalCells);
	let occCount = 0;
	let remainingCounts = counts.slice();
	let remainingArea = totalAreaRequired;

	function allPlaced() {
		for (let i = 0; i < remainingCounts.length; i++) {
			if (remainingCounts[i] > 0) return false;
		}
		return true;
	}

	function dfs() {
		if (allPlaced()) return true;

		let freeCells = totalCells - occCount;
		if (remainingArea > freeCells) return false;

		let bestType = -1;
		let bestOptions = Infinity;

		for (let i = 0; i < remainingCounts.length; i++) {
			if (remainingCounts[i] <= 0) continue;
			let placements = placementsByShape[i];
			let options = 0;

			for (let cells of placements) {
				let ok = true;
				for (let k = 0; k < cells.length; k++) {
					if (occupied[cells[k]]) {
						ok = false;
						break;
					}
				}
				if (ok) {
					options++;
					if (options >= bestOptions) break;
				}
			}

			if (options === 0) return false;

			if (options < bestOptions) {
				bestOptions = options;
				bestType = i;
			}
		}

		let placements = placementsByShape[bestType];
		let area = shapeAreas[bestType];

		for (let cells of placements) {
			let ok = true;
			for (let k = 0; k < cells.length; k++) {
				if (occupied[cells[k]]) {
					ok = false;
					break;
				}
			}
			if (!ok) continue;

			// place
			for (let k = 0; k < cells.length; k++) {
				occupied[cells[k]] = 1;
			}
			occCount += area;
			remainingCounts[bestType]--;
			remainingArea -= area;

			if (dfs()) return true;

			// undo
			for (let k = 0; k < cells.length; k++) {
				occupied[cells[k]] = 0;
			}
			occCount -= area;
			remainingCounts[bestType]++;
			remainingArea += area;
		}

		return false;
	}

	return dfs();
}


function solve(part=1){ 
	let numShapes = shapes.length;
	let shapeVariants = [];
	let shapeAreas = [];

	for (let i = 0; i < numShapes; i++) {
		let base = shapes[i];
		shapeVariants.push(generateOrientations(base));

		let area = 0;
		for (let row of base) {
			for (let c = 0; c < row.length; c++) {
				if (row[c] === "#") area++;
			}
		}
		shapeAreas.push(area);
	}

	let validCount = 0;
	for (let grid of grids) {
		if (canSolveGrid(grid, shapeVariants, shapeAreas)) {
			validCount++;
		}
	}

	return validCount;
} 

parse("Day12.txt");

console.log(`Part 1: ${solve(1)}`);