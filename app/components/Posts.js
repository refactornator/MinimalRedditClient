import React, { Component, PropTypes } from 'react';

import { fetchPostsIfNeeded, invalidateReddit } from '../actions';

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
      if(currentIndex <= this.props.posts.length) {
        this.setState({
          currentIndex: currentIndex + 1
        });
      }
    }

    if(currentIndex >= Math.max(this.props.posts.length - 3, 0)) {
      const { dispatch, selectedReddit } = this.props;
      dispatch(invalidateReddit(selectedReddit));
      dispatch(fetchPostsIfNeeded(selectedReddit));
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
        <span className="title">{post.data.title}</span>
        <img key={post.id} src={post.data.url} />
      </div>
    );
  }
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired
};
