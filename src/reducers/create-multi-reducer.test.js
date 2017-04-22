import redux from 'redux';
import createReducer from './create-reducer';
import createTree from './create-multi-reducer';

jest.mock('redux', () => ({ combineReducers: jest.fn() }));
jest.mock('./create-reducer', () => jest.fn().mockReturnValue('created-reducer'));

describe('create-multi-reducer', () => {
  describe('when reducers not an object', () => {
    it('throws an error', () => {
      expect(() => createTree('not an object')).toThrow();
    })
  })

  describe('when reducers contains an item that isn\'t an object or function', () => {
    it('throws an error', () => {
      expect(() => createTree({ cat: 'not an object or function' })).toThrow();
    })
  })

  describe('when reducers are valid', () => {
    const catReducer = () => 'cat';
    const dogReducer = {
      initial: 'not-dog-value',
      'DOG_ACTION': 'dog-value'
    }
    const reducers = {
      cat: catReducer,
      dog: dogReducer
    };
    const expectedConfig = {
      cat: catReducer,
      dog: 'created-reducer'
    }

    let result

    beforeEach(() => {
      result = createTree(reducers)
    })

    it('calls combineReducers with the generated reducer object', () => {
      expect(redux.combineReducers).toHaveBeenCalledWith(expectedConfig)
    })

    it('uses create-reducer to create reducers that were defined as objects', () => {
      expect(createReducer).toHaveBeenCalledWith(dogReducer)
    })
  })
})