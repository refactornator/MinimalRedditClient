import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectReddit, fetchPostsIfNeeded, invalidateReddit } from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';
import './posts.css';

class AsyncApp extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedReddit } = this.props;
    dispatch(fetchPostsIfNeeded(selectedReddit));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedReddit !== this.props.selectedReddit) {
      const { dispatch, selectedReddit } = nextProps;
      dispatch(fetchPostsIfNeeded(selectedReddit));
    }
  }

  handleChange(nextReddit) {
    this.props.dispatch(selectReddit(nextReddit));
  }

  handleRefreshClick(e) {
    e.preventDefault();

    const { dispatch, selectedReddit } = this.props;
    dispatch(invalidateReddit(selectedReddit));
    dispatch(fetchPostsIfNeeded(selectedReddit));
  }

  render() {
    const { dispatch, selectedReddit, posts, isFetching, lastUpdated, error } = this.props;
    const windowHeight = document.body.offsetHeight;

    console.log("ERROR:", error);
    return(
      <div>
        <Picker value={selectedReddit}
                onChange={this.handleChange}
                options={['pics', 'funny']} />
        {posts.length > 0 &&
          <div className="posts" style={{ width: '100%', opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} selectedReddit={selectedReddit} dispatch={dispatch} />
          </div>
        }
      </div>
    );
  }
}

AsyncApp.PropTypes = {
  selectedReddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispath: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { postsByReddit, selectedReddit } = state;

  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsByReddit[selectedReddit] || {
    isFetching: true,
    items: []
  };

  return {
    selectedReddit,
    posts,
    isFetching,
    lastUpdated
  };
}

export default connect(mapStateToProps)(AsyncApp);
