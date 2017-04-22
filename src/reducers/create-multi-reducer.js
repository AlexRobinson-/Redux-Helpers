import { combineReducers } from 'redux';
import isObject from './../utils/is-object';
import createReducer from './create-reducer';

const getReducer = reducer => {
  if (typeof reducer === 'function') {
    return reducer;
  }

  if (isObject(reducer)) {
    return createReducer(reducer)
  }

  throw new Error('reducer must be a function or object')

}

const createMultiReducer = reducers => {
  if (!isObject(reducers)) {
    throw new Error('reducers must be an object');
  }

  return combineReducers(
    Object.keys(reducers).reduce(
      (all, reducer) => ({
        ...all,
        [reducer]: getReducer(reducers[reducer])
      }), {}
    )
  );
}

export default createMultiReducer;
