import {combineReducers} from 'redux';
import createReducer from './create-reducer';

const createTree = reducers => combineReducers(
  Object.keys(reducers).reduce(
    (all, reducer) => ({
      ...all,
      [reducer]: typeof reducers[reducer] === 'function' ? reducers[reducer] : createReducer(reducers[reducer])
    }), {}
  )
);

export default createTree;
