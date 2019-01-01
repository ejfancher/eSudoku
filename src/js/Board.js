import React from 'react';
import ReactDOM from 'react-dom';
import {Cell} from './Cell.js'
import {LogicBoard} from './LogicBoard';

export class Board extends React.Component {
	constructor(props){
		super(props);

		this.changeCellValue = this.changeCellValue.bind(this);
		this.getConfType = this.getConfType.bind(this);
		this.state = {
//board_string "injected" into a <script> in the final html
			board : new LogicBoard(board_string), 
/* user_value_conflicts keeps a tab on all values the user has
 entered that are in conflict with another cell */
			user_value_conflicts : [], 
/* other_conflicts contains user entered and preset value conflicts 
to show on the board temporarily (until the user clicks anywhere on the 
board) what cells their latest input was in conflict with. */
			other_conflicts : [] 
		};
		this.state.grid = this.state.board.get_rows()
	}

//call back function to edit the value of a cell in the board
    changeCellValue(m, n, val){
		this.state.board.set_cell_value_mn(m, n, val)
		
		this.updateConflicts(m, n, val)

		this.setState({grid: this.state.board.get_rows()})
	}

	updateConflicts(m, n, val) {
		this.state.other_conflicts = []

		if (val != 0) { // if the change was not a deletion, but a edit to a value 1-9
			var conflicts = this.state.board.get_conflicts(m,n)
			if (conflicts.length > 0) {	/* if there was a conflict caused by the
			new value of the cell, add it's and its' conflicts coordinates to the 
			correct conflict list */
				this.state.user_value_conflicts.push([m, n]);
				for (var i=0; i<conflicts.length; i++) {
					if (conflicts[i][0] != m || conflicts[i][1] != n) {
						this.state.other_conflicts.push([conflicts[i][0], conflicts[i][1]])
					}
				}
			}
		}
		else { // if the change was was a deletion
			for (var i=0; i<this.state.user_value_conflicts.length; i++) { // remove the user entered conflict on the current (now empty) cell
				if (this.state.user_value_conflicts[i][0] == m && this.state.user_value_conflicts[i][1] == n) {
					this.state.user_value_conflicts.splice(i, 1)
					break
				}
			}
			/* The only way to cause a cell with a user entered value that caused a conflict on initial input
			   into the board to no longer be causing a conflict is to delete a cell somewhere on the board. 
			   Deleting a cell half way into a game could cause the first cell entered during the game to be
			   relieved of its conflicts. As such we reevaluate all stored conflicts in user_value_conflicts
			   for being in conflict everytime a deletion is made, and remove a cell from user_value_conflicts
			   if its no longer in conflict: */
			while (!parsing_complete) {
				var parsing_complete = true
				for (var i=0; i<this.state.user_value_conflicts.length; i++) {
					let conf_m = this.state.user_value_conflicts[i][0];
					let conf_n = this.state.user_value_conflicts[i][1];
					let confs = this.state.board.get_conflicts(conf_m, conf_n);
					if (confs.length === 0) {
						this.state.user_value_conflicts.splice(i, 1)
						parsing_complete = false
						continue
					}
				}
			}
		}
		this.setState({user_value_conflicts: this.state.user_value_conflicts,
					other_conflicts: this.state.other_conflicts})
	}


/* if the cell at m, n is conflicting returns whether the cell is a 
user entered cell or a preset cell, or false if its not conflicting */
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
		return (<table><tbody>
					{
						this.state.grid.map((row, m) => { 
						return( 
						<tr>
							{row.map((elem, n) => {

								var confVal = this.getConfType(m, n);

								return (<td key={m+', '+n}> 
											<Cell logicCell={this.state.grid[m][n]} setNumber={(m, n, val) => this.changeCellValue(m, n, val)}
											 m={m} n={n} conf={confVal} handleClick={() => this.setState({other_conflicts: []})}/>
									 	</td>) })}
						</tr>)})
					}
				</tbody></table>);
	}
}