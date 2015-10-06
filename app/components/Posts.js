import React, { Component, PropTypes } from 'react';

import { fetchPostsIfNeeded, invalidateReddit } from '../actions';

import './posts.scss';

const KEYS = {
  left: 37,
  right: 39
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
    let post = this.props.posts[this.state.currentIndex];
    let Media;
    if(post.data.url.endsWith('.gifv')) {
      post.data.url = post.data.url.replace('.gifv', '.gif');
    }

    if(post.data.url.indexOf('//imgur.com/a/') !== -1) {
      Media = post.data.images.map(function(image) {
        return <img src={image.link} />
      });
    } else {
      Media = <img src={post.data.url} />;
    }

    console.log(post.data.url);

    return(
      <div key={post.id} className="post">
        <span className="title">{post.data.title}</span>
        {Media}
      </div>
    );
  }
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired
};
