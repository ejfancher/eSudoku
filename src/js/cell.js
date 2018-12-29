import React from 'react';
import ReactDOM from 'react-dom';


export class Cell extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      // the cell from class logicCell that this Cell component is representing
      logicCell: this.props.logicCell, 
      /* if a value was part of the starting game board it is a locked
       preset cell, viewable in blue font. Otherwise it's changeable. */
      cellType: this.props.logicCell.is_locked() ? 'locked_preset' : 'user_changeable'
    };
  }

  handleChange(event) {
    var curVal = event.target.value
    if (curVal == '' || ((curVal > 0) && (curVal < 10))){
      if (!this.state.logicCell.is_locked()){
        this.props.setNumber(this.props.m, this.props.n, curVal == '' ? 0 : curVal);
      }
    }
  }

  handleClick() {
    this.props.handleClick()
  }

  render(){
    const curNumber = (this.props.logicCell.get_value() == 0) ? '' : this.props.logicCell.get_value()

    const partOfCrossHair = this.props.partOfCrossHair
    const m = this.props.m;
    const n = this.props.n;

    const cellType = this.state.cellType;

    return (<input type="tel" value={curNumber} partOfCrossHair={partOfCrossHair} onChange={this.handleChange} onClick={this.handleClick} className={cellType}
     onMouseOver={() => this.props.addCrossHairs(m, n)} conf={this.props.conf}/> );
  } 
}