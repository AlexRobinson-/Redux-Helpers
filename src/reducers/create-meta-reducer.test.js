import createMetaReducer from './create-meta-reducer';

describe('create-meta-reducer', () => {
  it('throws an error when callback not a function', () => {
    expect(() => createMetaReducer('something', 'cat')).toThrow();
  })

  it('returns a function', () => {
    expect(typeof createMetaReducer('something', () => undefined)).toEqual('function');
  })

  describe('reducer', () => {
    const callbackMock = jest.fn().mockReturnValue('some return value');
    const currentState = 'current state';

    describe('when action has a meta field that matches the meta string', () => {
      const metaPayload = { some: 'thing' };
      const action = { type: 'SOME_ACTION', payload: {}, meta: { 'someMetaString': metaPayload } }

      beforeEach(() => {
        const reducer = createMetaReducer('someMetaString', callbackMock);
        reducer(currentState, action)
      })

      it('returns the result of the callback function', () => {
        expect(callbackMock).toHaveBeenCalledWith(currentState, metaPayload, action);
      })
    })

    describe('when action does not have a meta field that matches the meta string', () => {
      let result

      beforeEach(() => {
        const reducer = createMetaReducer('someMetaString', callbackMock);
        result = reducer(currentState, { type: 'SOME_ACTION', payload: {}, meta: { 'notSomeMetaString': {} } })
      })

      it('returns the old state', () => {
        expect(result).toEqual(currentState);
      })
    })
  })
})
