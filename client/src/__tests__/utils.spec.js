import { expect } from '../lib/test-utils'
import { gravatar, purify, gpsCoords } from '../lib/utils'

describe('lib > utils.js > gravatar', () => {
  it('should return correct url with hashed email', () => {
    expect(gravatar('toto@gmail.com')).to.equal(
      'https://www.gravatar.com/avatar/5a3f2bbc4a48a3b65438890ecb202aba?d=retro'
    )
  })
})

describe('lib > utils.js > purify', () => {
  it.concurrent('should purify dirty html correctly', async () => {
    let str = await purify('<img src=x onerror=alert(1)//>')
    expect(str).to.equal('<img src="x">')
    str = await purify('<svg><g/onload=alert(2)//<p>')
    expect(str).to.equal('<svg><g></g></svg>')
    str = await purify('<p>abc<iframe//src=jAva&Tab;script:alert(3)>def')
    expect(str).to.equal('<p>abc</p>')
    str = await purify('<math><mi//xlink:href="data:x,<script>alert(4)</script>">')
    expect(str).to.equal('<math><mi></mi></math>')
    str = await purify('<TABLE><tr><td>HEY</tr></TABL>')
    expect(str).to.equal('<table><tbody><tr><td>HEY</td></tr></tbody></table>')
    str = await purify('<UL><li><A HREF=//google.com>click</UL>')
    expect(str).to.equal('<ul><li><a href="//google.com">click</a></li></ul>')
  })
})

describe('lib > utils.js > gpsCoords', () => {
  it('should convert gps coordinates to DMS', () => {
    const coord = gpsCoords(4.931609, -52.3009)
    expect(coord).to.equal('4° 55′ 53″ N, 52° 18′ 3″ W')
  })
})
