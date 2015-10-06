import fetch from 'isomorphic-fetch';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const FAILURE_POSTS = 'FAILURE_POSTS';
export const SELECT_REDDIT = 'SELECT_REDDIT';
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT';

let after = null;

export function selectReddit(reddit) {
  after = null;

  return {
    type: SELECT_REDDIT,
    reddit
  };
}

export function invalidateReddit(reddit) {
  return {
    type: INVALIDATE_REDDIT,
    reddit
  };
}

function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  };
}

function receivePosts(reddit, json) {
  var children = json.data.children.filter(function(child) {
    if(child.data.url && child.data.url.indexOf('imgur.com') !== -1) {
      return true;
    } else {
      return false;
    }
  }).map(function(child) {
    if(child.data.url && child.data.url.indexOf('//imgur.com') !== -1) {
      if(child.data.url.indexOf('//imgur.com/a/') !== -1) {
        let albumId = child.data.url.substr(child.data.url.indexOf('/a/') + 3);
        let url = `https://api.imgur.com/3/album/${albumId}/images`;
        fetch(url, {
          headers: {
            'Authorization': 'Client-ID e0c0f3dae8b063f'
          }
        })
        .then(res => {
          if (res.status >= 400) {
            throw new Error("Failed to retreive");
          }
          return res.json();
        })
        .then(json => {
          child.data.images = json.data;
        });
      } else {
        child.data.url = child.data.url.replace('imgur.com', 'i.imgur.com') + '.jpg';
      }
    }
    return child;
  });

  return {
    type: RECEIVE_POSTS,
    reddit: reddit,
    posts: children,
    receivedAt: Date.now()
  };
}

function failurePosts(reddit, error) {
  return {
    type: FAILURE_POSTS,
    reddit: reddit,
    error: error
  }
}
function fetchPosts(reddit) {
  return dispatch => {
    dispatch(requestPosts(reddit));
    var url = `http://www.reddit.com/r/${reddit}.json?limit=100`;
    
    if(after != null) {
      url += `&after=${after}`;
    }

    return fetch(url)
      .then(res => {
        if (res.status >= 400) {
          throw new Error("Failed to retreive");
        }
        return res.json();
      })
      .then(json => {
        if(json.data.after) {
          after = json.data.after;
        }

        return dispatch(receivePosts(reddit, json));
      })
      .catch(error => {
        console.log('ERRORR');
        return dispatch(failurePosts(reddit, error));
      });
  };
}

function shouldFetchPosts(state, reddit) {
  const posts = state.postsByReddit[reddit];

  if (posts && posts.isFetching) {
    return false;
  } else {
    return true;
  }
}

export function fetchPostsIfNeeded(reddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
      return dispatch(fetchPosts(reddit));
    }
  };
}
