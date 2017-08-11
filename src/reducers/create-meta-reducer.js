export default (metaTag, callback) => {
  if (typeof callback !== 'function') {
    throw new Error('createMetaReducer expects second param to be a function');
  }

  return (state = {}, action) => {
    if (action && action.meta && action.meta[metaTag]) {
      return callback(state, action.meta[metaTag], action)
    }

    return state;
  }
}