import isObject from './../utils/is-object';

export default (config = {}) => {
  if (!isObject(config)) {
    throw new Error('createReducer requires config to be an object')
  }

  if (config.default !== undefined && typeof config.default !== 'function') {
    throw new Error('createReducer default must be a function');
  }

  return (state = {}, action, ...params) => {
    if (action.type === 'initial') {
      return state;
    }

    const handler = config[action.type];

    if (handler === undefined) {
      if (config.default) {
        return config.default(state, action, ...params);
      }

      return state;
    }

    if (!Array.isArray(handler)) {
      throw new Error('dynamic reducer action handlers must return an array [id(s), newState]');
    }

    const [getIds, getNewState] = handler;
    if (typeof getIds !== 'function') {
      throw new Error('dynamic reducer action handler must return a function to get the id(s) to update');
    }

    const id = getIds(action);
    const ids = Array.isArray(id) ? id : [id]

    return ids.reduce(
      (newState, id) => ({
        ...newState,
        [id]: typeof getNewState === 'function' ? (getNewState(newState[id] === undefined ? config.initial : newState[id], action, ...params)) : getNewState
      }), state
    )
  }
}
