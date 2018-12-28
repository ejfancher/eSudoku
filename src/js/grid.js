import React from 'react';
import ReactDOM from 'react-dom';
import {Cell} from './cell.js'
import {Board} from './Board';

export class Grid extends React.Component {
	constructor(props){
		super(props);
		this.addCrossHairs = this.addCrossHairs.bind(this);
		this.rmCrossHairs = this.rmCrossHairs.bind(this);
		this.changeCellValue = this.changeCellValue.bind(this);
		this.getConfType = this.getConfType.bind(this);

		if (board_string == null || board_string == "") {
			var board_string = "111111111111111111111111111111111111111111111111111111111111111111111111111111111"
		}

		this.state = {
			board : new Board(board_string), //board_string "injected" into a <script> in the final html
			crossHairM : -1,
			crossHairN : -1,
			user_value_conflicts : [], // only the latest user entered value that is conflicting will be marked as being in conflict
			other_conflicts : [] // contains user entered and preset value conflicts, however the conf attribute on the Cell JSX makes sure that they are colored according to being user or preset values
		};
		this.state.grid = this.state.board.get_rows()
	}

	updateConflicts(m, n, val) {

		this.state.other_conflicts = []

		if (val != 0) { // if the change was not a deletion, but a value 1-9
			var conflicts = this.state.board.get_conflicts(m,n,val)
			if (conflicts.length > 0) {	// if there was a conflict caused by the new value, add its cell and its conflicts to the right conflict lists
				this.state.user_value_conflicts.push([m, n]);
				for (var i=0; i<conflicts.length; i++) {
					if (conflicts[i][0] != m || conflicts[i][1] != n) {
						this.state.other_conflicts.push([conflicts[i][0], conflicts[i][1]])
					}
				}
			}
		}
		else {
			for (var i=0; i<this.state.user_value_conflicts.length; i++) { // remove the user entered conflict on the current (now empty) cell
				if (this.state.user_value_conflicts[i][0] == m && this.state.user_value_conflicts[i][1] == n) {
					this.state.user_value_conflicts.splice(i, 1)
					break
				}
			}
			/* The only way to cause a cell with a user entered value that caused a conflict on initial input
			   into the board to no longer be causing a conflict is to delete a cell somewhere on the board. 
			   Deleting a cell half way into a game could cause the first cell entered during the game to be
			   relieved of its conflicts. As such we check all stored conflicts in user_value_conflicts for conflicts
			   everytime time a deletion is made. */
			while (!parsing_complete) {
				var parsing_complete = true
				for (var i=0; i<this.state.user_value_conflicts.length; i++) {
					let conf_m = this.state.user_value_conflicts[i][0];
					let conf_n = this.state.user_value_conflicts[i][1];
					let confs = this.state.board.get_conflicts(conf_m, conf_n, this.state.board.get_cell_value_mn(conf_m, conf_n));
					if (confs.length === 0) {
						this.state.user_value_conflicts.splice(i, 1)
						//console.log('removing '+conf_m+', '+conf_n+' from user_value_conflicts.')
						parsing_complete = false
						continue
					}
				}
			}
		}
		this.setState({user_value_conflicts: this.state.user_value_conflicts,
					other_conflicts: this.state.other_conflicts})
	}

//call back function changing a cell in the grid
    changeCellValue(m, n, val){
		this.state.board.set_cell_value_mn(m, n, val)
		
		this.updateConflicts(m, n, val)
		//console.log(this.state.board.get_conflicts())
		this.setState({grid: this.state.board.get_rows()})
		//board.set_cell_value_mn(m, n, originalVal)
	}

// adds the col, row mouseover focus
	addCrossHairs(m, n){
		this.setState({crossHairM: m,
					crossHairN: n})
	}

// rms the col, row mouseover focus
	rmCrossHairs(){
		//console.log('rmCrossHairs()')
     	this.setState({crossHairM: -1,
     				crossHairN: -1})
    }

// if the sell at m, n is conflicting returns whether the cell is a user entered cell or a preset cell, or false if its not conflicting
    getConfType(m, n) {
    	var conflicting = false;

		for (var i=0; i<this.state.user_value_conflicts.length; i++){
			if (m == this.state.user_value_conflicts[i][0] && n == this.state.user_value_conflicts[i][1]){
				conflicting = true;
			}
		}

		for (var i=0; i<this.state.other_conflicts.length; i++){
			if (m == this.state.other_conflicts[i][0] && n == this.state.other_conflicts[i][1]){
				conflicting = true;
			}
		}

		var confVal = 'false'

		if (conflicting == true){
			if (this.state.grid[m][n].is_locked()){
				confVal = 'preset'
			}
			else {
				confVal = 'user'
			}
		}
		return confVal
    }

	render() {

		//console.log('render()')
		const chm = this.state.crossHairM;
		const chn = this.state.crossHairN;

		return (<table class='sudoku_board' onMouseLeave={() => this.rmCrossHairs()}>
					{
						this.state.grid.map((row, m) => { 
						return( 
						<tr>
							{row.map((elem, n) => {
								const partOfCrossHair = ((m === chm) || (n === chn)) ? 'true' : 'false'

								var confVal = this.getConfType(m, n);

								return (<td key={m+', '+n} className='cell'> 
											<Cell logicalCell={this.state.grid[m][n]} m={m} n={n} partOfCrossHair={partOfCrossHair} conf={confVal} setNumber={(m, n, val) => this.changeCellValue(m, n, val)}
											 addCrossHairs={(m, n) => this.addCrossHairs(m, n)} handleClick={() => this.setState({other_conflicts: []})}/>
									 	</td>) })}
						</tr>)})
					}
				</table>);
	}
}