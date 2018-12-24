import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';


export class Cell extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      logicalCell: this.props.logicalCell, 
      cellType: this.props.logicalCell.is_locked() ? 'locked_preset' : 'user_changeable'
    };
  }

  handleChange(event) {
    var curVal = event.target.value
    if (curVal == '' || ((curVal > 0) && (curVal < 10))){
      if (!this.state.logicalCell.is_locked()){
        this.props.setNumber(this.props.m, this.props.n, curVal == '' ? 0 : curVal);
      }
    }
  }

  handleClick() {
    this.props.handleClick()
  }

  render(){
    const curNumber = (this.props.logicalCell.get_value() == 0) ? '' : this.props.logicalCell.get_value()

    const partOfCrossHair = this.props.partOfCrossHair
    const m = this.props.m;
    const n = this.props.n;

    const cellType = this.state.cellType;

    return (<input type="text" value={curNumber} partOfCrossHair={partOfCrossHair} onChange={this.handleChange} onClick={this.handleClick} className={cellType}
     onMouseOver={() => this.props.addCrossHairs(m, n)} conf={this.props.conf}/> );
  } 
}