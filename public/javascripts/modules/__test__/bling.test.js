import { b, bb } from '../bling'

describe('bling', () => {
  document.body.innerHTML = `
    <div id="byId" class="byClass"></div>
    <div id="byId2" class="byClass">content</div>
  `
  const byId = b('#byId')
  const byClass = bb('.byClass')

  it('works when single query selection', () => {
    expect(byId).not.toBeNull()
    expect(byId).toBeEmpty()
    expect(b('#byId2')).toContainHTML(
      '<div id="byId2" class="byClass">content</div>'
    )
  })

  it('works when multiple query selection', () => {
    expect(byClass.length).toBe(2)
  })

  it('works when adding events', () => {
    byId.on('click', () => {
      byId.innerHTML = 'Clicked!'
    })
    byId.click()
    expect(byId.innerHTML).toBe('Clicked!')

    byClass.on('click', function () {
      this.classList.add('clicked') // eslint-disable-line babel/no-invalid-this
    })
    byClass.forEach(elem => elem.click()) // click each element
    byClass.forEach(elem => expect(elem).toHaveClass('clicked'))
  })
})
