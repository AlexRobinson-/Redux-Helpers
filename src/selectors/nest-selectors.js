import isObject from './../utils/is-object';

export default (selectors, getState = state => state) => {
  if (!isObject(selectors)) {
    throw new Error('nestSelectors expects first argument to be an object');
  }

  if (typeof getState !== 'function') {
    throw new Error('nestSelectors expects second argument to be a function');
  }

  return Object.keys(selectors).reduce(
    (nested, selector) => {
      if (typeof selectors[selector] !== 'function') {
        throw new Error(`selector ${selector} is not a function`);
      }

      return {
        ...nested,
        [selector]: (state, ...params) => selectors[selector](getState(state), ...params)
      };
    }, {}
  );
}
