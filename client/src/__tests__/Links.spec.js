import React from 'react'
import Link from '../components/addons/Link'
import { expect, shallow } from '../lib/test-utils'

describe('<Links/>', () => {
  it('should render "internal" links correctly', () => {
    const wrapper = shallow(<Link to='/'>My Link</Link>)
    expect(wrapper).to.matchSnapshot()
  })

  it('should render "internal file" links correctly', () => {
    const wrapper = shallow(<Link to='/test.pdf'>My Link</Link>)
    expect(wrapper).to.matchSnapshot()
  })

  it('should render "internal links with noprefetch" correctly', () => {
    const wrapper = shallow(
      <Link noprefetch to='/lieu/id'>
        My Link
      </Link>
    )
    expect(wrapper).to.matchSnapshot()
  })

  it('should render "external" links correctly', () => {
    const wrapper = shallow(
      <Link blank to='https://www.google.com'>
        My Link
      </Link>
    )
    expect(wrapper).to.matchSnapshot()
  })

  it('should render links with custom props', () => {
    const wrapper = shallow(
      <Link prop1='other' prop2='prop2' prop3={() => {}} to='/'>
        My Link
      </Link>
    )
    expect(wrapper).to.matchSnapshot()
  })
})
