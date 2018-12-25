import {LogicalCell} from './LogicalCell.js'


export class Board {

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

		this.conflicts = [] // TODO: Consider saving the userVal and defaultVal conflicts in Grid or in 
							// here, either seperately or all in one list/set. You'll have to bring
							// cellType state up to atleast Grid, possibly here. 
							// If you do then you can add a divide up the two kinds of conflicts, 
							// having conf='user' or 'default' or 'false'. And for instance when a 
							// conf='user' gets a setValue() call of 0 (nothing) then it will be cleared
							// of conflicts thus get conf='false'.

		var i = 0; // Iterator for the loop.
		for(i = 0; i < 81; i++) {
			this.board[i] = new LogicalCell(boardString.charAt(i), i); // Initializes a new cell in the board array.
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
	get_rows() {
		return this.row;
	}
	get_cols() {
		return this.col;
	}
	get_boxes() {
		return this.box;
	}

	// A getter that just returns the numerical values of the cells in a 2D array
	get_board_values() {
		this.board_vals = [];
		var i = 0;
		for (i = 0; i < 9; i++) {
			var j = 0;
			this.board_vals[i] = [];
			for (j = 0; j < 9; j++) {
				this.board_vals[i][j] = this.row[i][j].get_value();
			}
		}
		return this.board_vals;
	}

	// A setter for the cell value for when the user inputs data.
	set_cell_value(num, value) {
		this.board[num].set_value(value);
	}

	// A getter for the cell value to update the board.
	get_cell_value(num) {
		return this.board[num].get_value();
	}

	get_cell_value_mn(m, n) {
		return this.row[m][n].get_value();
	}

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

	// A checker to see if a row is valid.
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

	// A checker to see if a column is valid.
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

	// A checker to see if a box is valid.
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

	is_nonconflicting() {
		var i = 0;
		for (i = 0; i < 9; i++) {
			if(!this.is_row_valid(i) || !this.is_col_valid(i) || !this.is_box_valid(i)) {
				return false;
			}
		}
		return true;
	}

	get_conflicts(m, n, new_val) {
		var conflicts = []
		var row_num = m
		var temp = [false, false, false, false, false, false, false, false, false];
		for (var i = 0; i < 9; i++) {
			if(this.row[row_num][i].get_value() == 0) {
				continue;
			}
			if(temp[this.row[row_num][i].get_value() - 1] && this.row[row_num][i].get_value() == new_val) {
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
			if(temp[this.col[col_num][i].get_value() - 1] && this.col[col_num][i].get_value() == new_val) {
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
			if(temp[this.box[box_num][i].get_value() - 1] && this.box[box_num][i].get_value() == new_val) {
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

	clear_conflicts() {
		this.conflicts = []
	}

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
