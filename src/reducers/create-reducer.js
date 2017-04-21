export default config => {
  return (state = config.initial, action) => {
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
