import action from './action';

describe('action', () => {
  test('throws error when payload is not an object', () => {
    expect(() => action('cat', 'dog')).toThrow()
  })

  test('throws error when meta is not an object', () => {
    expect(() => action('cat', {}, 'dog')).toThrow()
  })

  test('throws error when type is not a string', () => {
    expect(() => action(123)).toThrow()
  })

  test('returns an action', () => {
    expect(action('cat', { cat: 'cat' }, { dog: 'dog' })).toEqual({
      type: 'cat',
      payload: {
        cat: 'cat'
      },
      meta: {
        dog: 'dog'
      }
    })
  })
})

