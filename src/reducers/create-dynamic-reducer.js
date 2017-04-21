export default config => {
  return (state = {}, action) => {
    const handler = config[action.type];

    if (handler === undefined) {
      if (config.default) {
        return config.default(state, action);
      }

      return state;
    }


    if (!Array.isArray(handler)) {
      return state;
    }


    const [getIds, getNewState] = handler;

    const id = getIds(action);
    const ids = Array.isArray(id) ? id : [id]



    return ids.reduce(
      (newState, id) => ({
        ...newState,
        [id]: typeof getNewState === 'function' ? (getNewState(newState[id] === undefined ? config.initial : newState[id], action)) : getNewState
      }), state
    )

  }
}
