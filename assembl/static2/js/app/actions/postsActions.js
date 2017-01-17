import PostService from '../services/postService';

class PostsActions {
  static fetchPosts(debateId) {
    const that = this;
    return function (dispatch) {
      dispatch(that.loadingPosts());
      return PostService.fetchPosts(debateId).then((posts) => {
        dispatch(that.resolvedFetchPosts(posts));
      }).catch((error) => {
        dispatch(that.failedFetchPosts(error));
      });
    };
  }
  static loadingPosts() {
    return {
      type: 'FETCH_POSTS',
      payload: null
    };
  }
  static resolvedFetchPosts(posts) {
    return {
      type: 'RESOLVED_FETCH_POSTS',
      payload: posts
    };
  }
  static failedFetchPosts(err) {
    return {
      type: 'FAILED_FETCH_POSTS',
      error: err
    };
  }
}

export default PostsActions;