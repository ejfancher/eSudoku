import {LogicCell} from './LogicCell.js'


export class LogicBoard {

	constructor(boardString) {
		this.board = []; // This is the main array for the board, intended to be of size 81.
		
		// The rows, cols, and boxes are initialized individually to properly utilize a loop of 81.
		// Initializing them in a nested loop would be possible, however, would become much more complicated
		// due to the different number of row or column requirements at each stage.
		this.row0 = []; this.row1 = []; this.row2 = []; this.row3 = []; this.row4 = []; this.row5 = []; this.row6 = []; this.row7 = []; this.row8 = [];
		// Stored individual rows
		this.row = [this.row0, this.row1, this.row2, this.row3, this.row4, this.row5, this.row6, this.row7, this.row8];

		this.col0 = []; this.col1 = []; this.col2 = []; this.col3 = []; this.col4 = []; this.col5 = []; this.col6 = []; this.col7 = []; this.col8 = [];
		// Stored individual columns
		this.col = [this.col0, this.col1, this.col2, this.col3, this.col4, this.col5, this.col6, this.col7, this.col8];

		this.box0 = []; this.box1 = []; this.box2 = []; this.box3 = []; this.box4 = []; this.box5 = []; this.box6 = []; this.box7 = []; this.box8 = [];
		// Stored individual boxes.
		this.box = [this.box0, this.box1, this.box2, this.box3, this.box4, this.box5, this.box6, this.box7, this.box8];

		this.conflicts = [] 

		var i = 0; // Iterator for the loop.
		for(i = 0; i < 81; i++) {
			this.board[i] = new LogicCell(boardString.charAt(i), i); // Initializes a new cell in the board array.
			// Passes the cell to the proper row, column, and box.
			this.row[Math.floor(i / 9)][i % 9] = this.board[i];
			this.col[i % 9][Math.floor(i / 9)] = this.board[i];
			var boxNum = Math.floor((i % 9) / 3) + (Math.floor(Math.floor(i / 9) / 3) * 3);
			var boxCell = (i % 3) + (Math.floor(i / 9) % 3) * 3;
			this.box[boxNum][boxCell] = this.board[i];
		}
	}

	// A section of getters.
	get_row(num) {
		return this.row[num];
	}
	get_col(num) {
		return this.col[num];
	}
	get_box(num) {
		return this.box[num];
	}
	
	// get the board as a 2d array
	get_rows() {
		return this.row;
	}
	get_cols() {
		return this.col;
	}
	get_boxes() {
		return this.box;
	}

	// A getter for getting the value of a cell by its matrix coordinates
	get_cell_value_mn(m, n) {
		return this.row[m][n].get_value();
	}

	// A getter for setting a cell's value by its matrix coordinates
	set_cell_value_mn(m, n, value) {
		this.row[m][n].set_value(value);
	}

	// A getter that returns the boolean array of the pencil marks.
	get_cell_pencil(num) {
		return this.board[num].get_pencil();
	}

	// A setter for the pencil mark of a cell.
	set_cell_pencil(num, mark) {
		this.board[num].set_pencil(mark);
	}

	// A checker to see if a row is valid (non-conflicting).
	is_row_valid(row_num) {
		var temp = [false, false, false, false, false, false, false, false, false];
		for (var i = 0; i < 9; i++) {
			if(this.row[row_num][i].get_value() == 0) {
				continue;
			}
			if(temp[this.row[row_num][i].get_value() - 1]) { // If the number is already marked as true, we return false.
				return false
			}
			else {
				temp[this.row[row_num][i].get_value() - 1] = true;
			}
		}
		return true;
	}

	// A checker to see if a column is valid (non-conflicting).
	is_col_valid(col_num) {
		var temp = [false, false, false, false, false, false, false, false, false];
		for (var i = 0; i < 9; i++) {
			if(this.col[col_num][i].get_value() == 0) {
				continue;
			}
			if(temp[this.col[col_num][i].get_value() - 1]) { // If the number is already marked as true, we return false.
				return false;
			}
			else {
				temp[this.col[col_num][i].get_value() - 1] = true;
			}
		}
		return true;
	}

	// A checker to see if a box is valid (non-conflicting).
	is_box_valid(box_num) {
		var temp = [false, false, false, false, false, false, false, false, false];
		for (var i = 0; i < 9; i++) {
			if(this.box[box_num][i].get_value() == 0) {
				continue;
			}
			if(temp[this.box[box_num][i].get_value() - 1]) { // If the number is already marked as true, we return false.
				return false;
			}
			else {
				temp[this.box[box_num][i].get_value() - 1] = true;
			}
		}
		return true;
	}

	// A checker to see if all rows, cols, boxes are valid.
	is_nonconflicting() {
		var i = 0;
		for (i = 0; i < 9; i++) {
			if(!this.is_row_valid(i) || !this.is_col_valid(i) || !this.is_box_valid(i)) {
				return false;
			}
		}
		return true;
	}

	/* returns the locations of all cells that are in conflict
	with the cell indicated by the m, n coordinates given as arguments
	(in other words having the same value as and being in the same column, 
	row, or box as the cell indicated by m, n coordinate arguments). */
	get_conflicts(m, n) {
		var conflicts = []
		var row_num = m
		var temp = [false, false, false, false, false, false, false, false, false];
		for (var i = 0; i < 9; i++) {
			if(this.row[row_num][i].get_value() == 0) {
				continue;
			}
			if(temp[this.row[row_num][i].get_value() - 1] && this.row[row_num][i].get_value() == this.get_cell_value_mn(m, n)) {
				for (var j = 0; j < 9; j++) {
					if (this.row[row_num][j].get_value() === this.row[row_num][i].get_value()){
						var ord = this.row[row_num][j].get_ordinal()
						conflicts.push([Math.floor((ord) / 9), (ord) % 9])
					}
				}
			}
			else {
				temp[this.row[row_num][i].get_value() - 1] = true;
			}
		}

		var col_num = n
		temp = [false, false, false, false, false, false, false, false, false];
		for (var i = 0; i < 9; i++) {
			if(this.col[col_num][i].get_value() == 0) {
				continue;
			}
			if(temp[this.col[col_num][i].get_value() - 1] && this.col[col_num][i].get_value() == this.get_cell_value_mn(m, n)) {
				for (var j = 0; j < 9; j++) {
					if (this.col[col_num][j].get_value() === this.col[col_num][i].get_value()){
						var ord = this.col[col_num][j].get_ordinal()
						conflicts.push([Math.floor((ord) / 9), (ord) % 9])
					}
				}
			}
			else {
				temp[this.col[col_num][i].get_value() - 1] = true;
			}
		}
		
		ord = m * 9 + n;
		var box_num = Math.floor((ord % 9) / 3) + (Math.floor(Math.floor(ord / 9) / 3) * 3);

		temp = [false, false, false, false, false, false, false, false, false];
		for (var i = 0; i < 9; i++) {
			if(this.box[box_num][i].get_value() == 0) {
				continue;
			}
			if(temp[this.box[box_num][i].get_value() - 1] && this.box[box_num][i].get_value() == this.get_cell_value_mn(m, n)) {
				for (var j = 0; j < 9; j++) {
					if (this.box[box_num][j].get_value() === this.box[box_num][i].get_value()){
						var ord = this.box[box_num][j].get_ordinal()
						conflicts.push([Math.floor((ord) / 9), (ord) % 9])
					}
				}
			}
			else {
				temp[this.box[box_num][i].get_value() - 1] = true;
			}
		}
		return conflicts
	}

	// checks if row is solved
	is_row_complete(row_num) {
		var i = 0;
		var temp = [false, false, false, false, false, false, false, false, false];
		for (i = 0; i < 9; i++) {
			if(this.row[row_num][i].get_value() == 0) {
				return false;
			}
			if(temp[this.row[row_num][i].get_value() - 1]) { // If the number is already marked as true, we return false.
				return false;
			}
			else {
				temp[this.row[row_num][i].get_value() - 1] = true;
			}
		}
		return true;
	}

	// checks if col is solved
	is_col_complete(col_num) {
		var i = 0;
		var temp = [false, false, false, false, false, false, false, false, false];
		for (i = 0; i < 9; i++) {
			if(this.col[col_num][i].get_value() == 0) {
				return false;
			}
			if(temp[this.col[col_num][i].get_value() - 1]) { // If the number is already marked as true, we return false.
				return false;
			}
			else {
				temp[this.col[col_num][i].get_value() - 1] = true;
			}
		}
		return true;
	}

	// checks if box is solved
	is_box_complete(box_num) {
		var i = 0;
		var temp = [false, false, false, false, false, false, false, false, false];
		for (i = 0; i < 9; i++) {
			if(this.box[box_num][i].get_value() == 0) {
				return false;
			}
			if(temp[this.box[box_num][i].get_value() - 1]) { // If the number is already marked as true, we return false.
				return false;
			}
			else {
				temp[this.box[box_num][i].get_value() - 1] = true;
			}
		}
		return true;
	}

	// checks if board is solved
	is_solved() {
		var i = 0;
		for (i = 0; i < 9; i++) {
			if(!this.is_row_complete(i) || !this.is_col_complete(i) || !this.is_box_complete(i)) {
				return false;
			}
		}
		return true;
	}
}
