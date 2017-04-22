import nestSelectors from './nest-selectors';

describe('nest-selectors', () => {
  it('throws an error if first argument not an object', () => {
    expect(() => nestSelectors('cat')).toThrow();
  });

  it('throws an error if second argument not a function', () => {
    expect(() => nestSelectors({}, 'dog')).toThrow();
  });

  it('throws an error if a selector is not an object', () => {
    expect(() => nestSelectors({ cat: 'dog' })).toThrow();
  });

  describe('selectors', () => {
    const state = { some: 'state' };
    const nestedState = { nested: 'state' };
    const getStateMock = jest.fn().mockReturnValue(nestedState);
    const selectors = {
      getCat: jest.fn().mockReturnValue(`cat-abc-def`),
      getDog: (someParam, someOtherParam) => `dog-${someParam}-${someOtherParam}`
    };
    let result;

    beforeEach(() => {
      result = nestSelectors(selectors, getStateMock);
    })

    it('doesn\'t lose any selectors', () => {
      expect(typeof result.getCat).toEqual('function')
      expect(typeof result.getDog).toEqual('function')
    })

    describe('when calling a selector', () => {
      beforeEach(() => {
        result.getCat(state, 'abc', 'def');
      })

      it('calls getState', () => {
        expect(getStateMock).toHaveBeenCalledWith(state);
      });

      it('calls the selector with the nested state + params', () => {
        expect(selectors.getCat).toHaveBeenCalledWith(nestedState, 'abc', 'def');
      })
    })
  })

});