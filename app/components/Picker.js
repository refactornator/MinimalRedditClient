import React, { Component, PropTypes } from 'react';

import './picker.scss';

export default class Picker extends Component {
  constructor(props) {
    super(props);

    this.state = { value: props.value };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({
      value
    });
  }

  render() {
    const { onKeyDown, options } = this.props;

    return(
      <div className="header">
        /r/<input className="subreddit" type="text" value={this.state.value} onKeyDown={e => onKeyDown(e)} onChange={e => this.handleChange(e.target.value)}>
        </input>
      </div>
    );
  }
}

Picker.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  value: PropTypes.string.isRequired,
  onKeyDown: PropTypes.func.isRequired
};
