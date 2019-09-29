import axios from 'axios'
import { addNewBtn, axiosGet, pagination, sliceStr } from '../utils'

describe('Utils: addNewBtn', () => {
  it('renders the add button correctly', () => {
    expect(addNewBtn()).toMatchSnapshot()
    expect(addNewBtn(true)).toMatchSnapshot()
  })
})

jest.mock('axios')

describe('Utils: axiosGet', () => {
  beforeEach(() => {
    axios.mockClear()
  })

  it('should return results', () => {
    axios.get.mockResolvedValue({ data: { name: 'Chris' } })
    axiosGet('fake-url', d => expect(d.name).toBe('Chris'))
  })

  it('should fail', () => {
    axios.get.mockRejectedValue({ err: 'bad' })
    axiosGet('fake-url', d => expect(d.err).toBe('bad'))
  })
})

describe('Utils: pagination', () => {
  it('displays first page with next button', () => {
    expect(pagination(1, 3)).toMatchSnapshot()
  })

  it('displays second page with previous and next buttons', () => {
    expect(pagination(2, 3)).toMatchSnapshot()
  })

  it('displays third page with previous button', () => {
    expect(pagination(3, 3)).toMatchSnapshot()
  })
})

describe('Utils: sliceStr', () => {
  it('works without limit parameter', () => {
    expect(sliceStr('Un test de chaîne coupée')).toBe(
      'Un test de chaîne co ...'
    )
  })

  it('works without limit parameter, short string', () => {
    expect(sliceStr('Un')).toBe('Un')
  })

  it('works with limit parameter', () => {
    expect(sliceStr('Un test de chaîne coupée', 10)).toBe('Un test de ...')
  })
})
