import React from 'react'
import { expect, render } from '../lib/test-utils'

import Page from '../components/addons/Page'

describe('<Page />', () => {
  it('should match its reference snapshot', () => {
    const wrapper = render(
      <Page className='pageClass'>
        <div className='contentDiv'>Content</div>
      </Page>
    )
    expect(wrapper).to.matchSnapshot()
  })
})
