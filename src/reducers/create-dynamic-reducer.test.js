import createDynamicReducer from './create-dynamic-reducer';

describe('create-dynamic-reducer', () => {
  it('throws when given a non-object', () => {
    expect(() => createDynamicReducer('cat')).toThrow()
  })

  it('throws when config.default is defined, but not a function', () => {
    expect(expect(() => createDynamicReducer({ default: null })).toThrow())
  })

  describe('reducer', () => {
    const notMatchingAction = { type: 'DOESN\'T_MATCH_ANYTHING' };
    const config = {
      SOME_ACTION: [jest.fn().mockReturnValue('cat'), 123],
      SOME_OTHER_ACTION: [jest.fn().mockReturnValue('dog'), jest.fn().mockReturnValue(456)],
    }
    let reducer

    const createReducer = (config) => {
      reducer = createDynamicReducer(config)
    }

    beforeEach(() => {
      createReducer(config)
    })

    it('is a function', () => {
      expect(typeof reducer).toEqual('function')
    })

    it('initializes to an object', () => {
      expect(reducer(undefined, notMatchingAction)).toEqual({})
    })

    describe('when action handler is defined', () => {
      describe('getId', () => {
        const getIdMock = jest.fn()
        const initialState = {
          1: 'cat'
        }
        const action = { type: 'SOME_ACTION' };

        beforeEach(() => {
          createReducer({
            SOME_ACTION: [getIdMock, 'cat']
          })
          reducer(initialState, action)
        })

        it('is called with the action', () => {
          expect(getIdMock).toHaveBeenCalledWith(action)
        })
      })

      describe('when getNewState is a function', () => {
        const getIdMock = jest.fn();
        const getStateMock = jest.fn();
        const initialState = {
          catState: 'cat',
          dogState: 'dog'
        };
        const action = { type: 'SOME_ACTION' };

        beforeEach(() => {
          createReducer({
            SOME_ACTION: [getIdMock, getStateMock]
          })
        })

        describe('when getId returns multiple ids', () => {
          beforeEach(() => {
            getIdMock.mockReturnValue(['catState', 'dogState']);
            reducer(initialState, action);
          })

          it('is called for each id', () => {
            expect(getStateMock.mock.calls).toEqual([
              ['cat', action],
              ['dog', action]
            ])
          })
        })

        describe('when getId returns a single id', () => {
          beforeEach(() => {
            getIdMock.mockReturnValue('catState');
            reducer(initialState, action);
          });

          it('is called once for the id', () => {
            expect(getStateMock).toHaveBeenCalledWith('cat', action);
          });
        });

        describe('when the id\'s sub state doesn\'t exist', () => {
          beforeEach(() => {
            getIdMock.mockReturnValue('someOtherState');
            reducer(initialState, action);
          })

          it('calls getNewState with config.initial', () => {
            expect(getStateMock).toHaveBeenCalledWith(config.initial, action);
          });
        })

        describe('new state', () => {
          let result;

          beforeEach(() => {
            getIdMock.mockReturnValue(['catState', 'dogState']);
            getStateMock
              .mockReturnValueOnce('new-cat-state')
              .mockReturnValueOnce('new-dog-state')

            result = reducer(initialState, action);
          })

          it('updates each id\'s sub state with the result of each getNewState call', () => {
            expect(result).toEqual({
              catState: 'new-cat-state',
              dogState: 'new-dog-state'
            });
          })
        })
      })

      describe('when getNewState is not a function', () => {
        const getIdMock = jest.fn().mockReturnValue('catState');
        const getState = 'some-new-state';
        const initialState = {
          catState: 'cat',
          dogState: 'dog'
        };
        const action = { type: 'SOME_ACTION' };
        let result;

        beforeEach(() => {
          createReducer({
            SOME_ACTION: [getIdMock, getState]
          })
          result = reducer(initialState, action);
        })

        it('updates the sub-state for each id with the value of getNewState', () => {
          expect(result).toEqual({
            catState: 'some-new-state',
            dogState: 'dog'
          })
        })
      })
    })

    describe('when action handler is not defined', () => {
      describe('when config.default is not defined', () => {
        const currentState = { cat: 'dog' }
        let result

        beforeEach(() => {
          createReducer({})
          result = reducer(currentState, { type: 'DOESN\'T_MATCH_ANYTHING' })
        })

        it('returns the old state', () => {
          expect(result).toEqual(currentState);
        })
      })

      describe('when config.default is defined', () => {
        const currentState = { cat: 'dog' }
        const action = { type: 'DOESN\'T_MATCH_ANYTHING' };
        const defaultStub = jest.fn().mockReturnValue('newState');
        let result

        beforeEach(() => {
          createReducer({ default: defaultStub })
          result = reducer(currentState, action)
        })

        it('calls config.default with the state and action', () => {
          expect(defaultStub).toHaveBeenCalledWith(currentState, action);
        })

        it('returns the result of calling config.default', () => {
          expect(result).toEqual('newState')
        })
      })
    })
  })
})