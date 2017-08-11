import isObject from './../utils/is-object';

export default (config = {}) => {
  if (!isObject(config)) {
    throw new Error('createReducer requires config to be an object')
  }

  if (config.initial === undefined) {
    throw new Error('initial state must be defined')
  }

  return (state = config.initial, action) => {
    if (action.type === 'initial') {
      return state;
    }

    const handler = config[action.type];

    if (handler === undefined) {
      if (config.default) {
        return config.default(state, action);
      }

      return state;
    }

    if (typeof handler === 'function') {
      return handler(state, action);
    }

    return handler
  }
}
