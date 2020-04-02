import ClassMatchers from './classMatchers'

describe('classMatchers', () => {
  it('matches snapshot', () => {
    expect(ClassMatchers).toMatchSnapshot()
  })
})

