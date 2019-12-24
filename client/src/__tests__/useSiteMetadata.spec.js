import { expect } from '../lib/test-utils'
import { renderHook } from '@testing-library/react-hooks'

import useSiteMetadata from '../lib/useSiteMetadata'

describe('useSiteMetadata', () => {
  it('should match its reference snapshot', () => {
    const { result } = renderHook(() => useSiteMetadata())
    expect(result).to.matchSnapshot()
  })
})
