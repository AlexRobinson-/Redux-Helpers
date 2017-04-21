export default (metaTag, callback) => (state = {}, action) => {
  if (action && action.meta && action.meta[metaTag]) {
    return callback(state, action.meta[metaTag])
  }

  return state;
}