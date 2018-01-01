function wrapValue(val, max) {
    // "Wrap" val to ensure 0 <= val < max
    val = val % max;
    if (val < 0) {
        val = max + val;
    }
    return val;
}

class Life {
    // Implementation of a variation of Conway's Game of Life that has a finite
    // board where the edges "wrap".
    constructor(width, height, initial) {
        this.width = width;
        this.height = height;

        if (initial === undefined) {
            this.cells = Array(width * height).fill(false);
        } else {
            this.setCells(initial);
        }
    }

    cellAt([x, y]) {
        return this.cells[x + y * this.width];
    }

    countNeighbors([x, y]) {
        return this.neighbors([x, y]).map(this.cellAt, this).filter(
                v => v).length;
    }

    neighbors([x, y]) {
        return [
            [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
            [x - 1, y], [x + 1, y],
            [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
        ].map(this.wrap, this);
    }

    nextCellState([x, y]) {
        const c = this.cellAt([x, y]);
        const n = this.countNeighbors([x, y]);

        // A cell is alive next gen iff it has 3 neighbors (even if currently
        // dead) or if it's already alive and has 2 neighbors.
        return (n === 3 || (c && n === 2));
    }

    nextState() {
        const newCells = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                newCells.push(this.nextCellState([x, y]));
            }
        }
        return newCells;
    }

    setCells(cells) {
        if (cells.length !== this.width * this.height) {
            throw 'Bad array length for cells array';
        }
        this.cells = cells;
    }

    step() {
        this.cells = this.nextState();
    }

    stringRep() {
        let rep = '';
        for (let y = 0; y < this.height; y++) {
            rep += rep.length > 0 ? '\n' : '';
            for (let x = 0; x < this.width; x++) {
               rep += this.cellAt([x, y]) ? '*' : '-';
            }
        }
        return rep;
    }

    wrap([x, y]) {
        return [
            wrapValue(x, this.width),
            wrapValue(y, this.height),
        ];
    }
}

export default Life;
