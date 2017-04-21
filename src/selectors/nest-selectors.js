export default (selectors, getState = state => state) => Object.keys(selectors).reduce(
  (nested, selector) => ({
    ...nested,
    [selector]: (state, ...params) => selectors[selector](getState(state), ...params)
  }), {}
);
