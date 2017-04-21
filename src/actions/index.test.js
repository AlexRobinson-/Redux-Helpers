import defaultExport, * as namedExports from './index';
import action from './action';

describe('actions index', () => {
  it('exports action as the default export', () => {
    expect(defaultExport).toEqual(action)
  })

  it('exports action as a named export', () => {
    expect(namedExports.action).toEqual(action)
  })
})