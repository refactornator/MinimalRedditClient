import React, { Component, PropTypes } from 'react';

import './posts.css';

const KEYS = {
  enter: 13,
  left: 37,
  right: 39,
  escape: 27,
  backspace: 8,
  comma: 188,
  shift: 16,
  control: 17,
  command: 91
};

export default class Posts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(event) {
    var keyDown = event.which;
    var currentIndex = this.state.currentIndex;

    if(keyDown === KEYS.left) {
      if(currentIndex >= 1) {
        this.setState({
          currentIndex: currentIndex - 1
        });
      }
    } else if(keyDown === KEYS.right) {
      this.setState({
        currentIndex: currentIndex + 1
      });
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    var post = this.props.posts[this.state.currentIndex];

    return(
      <div className="post">
        <span>{post.data.title}</span>
        <img key={post.id} src={post.data.url.replace('imgur', 'i.imgur') + '.jpg'} />
      </div>
    );
  }
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired
};
