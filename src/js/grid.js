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

		this.state = {
			board : new Board(board_string), //board_string "injected" into a <script> in the final html
			crossHairM : -1,
			crossHairN : -1,
			user_value_conflicts : [], // only the latest user entered value that is conflicting will be marked as being in conflict
			other_conflicts : [] // containts user entered and preset value conflicts, howeve the conf attribute on the Cell JSX makes sure that they are colored according to being user or preset values
		};
		this.state.grid = this.state.board.get_rows()
	}

	updateConflicts(m, n, val) {
		var conflicts = this.state.board.get_conflicts(m,n,val)

		this.state.other_conflicts = []

		if (conflicts.length > 0){	// if there was a conflict caused by the new value, add its cell and its conflicts to the right conflict lists
			this.state.user_value_conflicts.push([m, n]);
			for (var i=0; i<conflicts.length; i++){
				if (conflicts[i][0] != m || conflicts[i][1] != n){
					this.state.other_conflicts.push([conflicts[i][0], conflicts[i][1]])
				}
			}
		}

		else {
			if (val == 0){	// else if there are no conflicts and the value change is a deletion, remove any user entered value conflict on the current cell
				for (var i=0; i<this.state.user_value_conflicts.length; i++){
					if (this.state.user_value_conflicts[i][0] == m && this.state.user_value_conflicts[i][1] == n){
						this.state.user_value_conflicts.splice(i, 1)
						break
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
		console.log('rmCrossHairs()')
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

		console.log('render()')
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