import isObject from './../utils/is-object';

export default (type, payload = {}, meta = {}) => {
  if (typeof type !== 'string') {
    throw new Error('type must be a string');
  }

  if (!isObject(payload) || !isObject(meta)) {
    throw new Error('payload and meta must be an object');
  }

  return { type, payload, meta };
};
