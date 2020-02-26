import { expect } from '../lib/test-utils'
import tzList from '../lib/tzList'
import { dateToStr, days, formatPlage, formatStart, userTZ, toUTCIsoDate, toZonedTime } from '../lib/date'

describe('lib > date.js > userTZ', () => {
  it('should match the user timezone code with the tz list', () => {
    const tzInList = tzList.filter(t => t.tzCode === userTZ()).length
    expect(tzInList).to.equal(1)
  })
})

describe('lib > date.js > toUTCIsoDate', () => {
  it('should convert zoned time to UTC', () => {
    // With timezone code
    let utcIso = toUTCIsoDate('2020-02-26T10:39:37.655', 'Europe/London')
    expect(utcIso).to.equal('2020-02-26T10:39:37.655Z')
    utcIso = toUTCIsoDate('2020-02-26T10:39:37.655', 'America/Argentina/Buenos_Aires')
    expect(utcIso).to.equal('2020-02-26T13:39:37.655Z')
    // With timezone offset and without code
    utcIso = toUTCIsoDate('2020-02-26T10:39:37.655-02:00')
    expect(utcIso).to.equal('2020-02-26T12:39:37.655Z')
  })
})

describe('lib > date.js > toZonedTime', () => {
  it('should convert UTC to zoned time', () => {
    let zonedTime = toZonedTime('2020-02-26T10:39:37.655', 'Europe/London')
    expect(zonedTime).to.eql(new Date('2020-02-26T16:39:37.655Z'))
    zonedTime = toZonedTime('2020-02-26T10:39:37.655Z', 'Europe/London')
    expect(zonedTime).to.eql(new Date('2020-02-26T13:39:37.655Z'))
    zonedTime = toZonedTime('2020-02-26T10:39:37.655-03:00', 'America/Argentina/Buenos_Aires')
    expect(zonedTime).to.eql(new Date('2020-02-26T13:39:37.655Z'))
  })
})

describe('lib > date.js > dateToStr', () => {
  it('should convert date to string date', () => {
    const d = '2020-02-26T13:39:37.655Z'
    let str = dateToStr(d, 'Europe/London')
    expect(str).to.equal('26 févr. 2020 à 13:39 (GMT)')
    str = dateToStr(d, 'America/Argentina/Buenos_Aires')
    expect(str).to.equal('26 févr. 2020 à 10:39 (GMT-3)')
    str = dateToStr(d, 'Europe/London', 'dd/MM/yyyy HH:mm')
    expect(str).to.equal('26/02/2020 13:39')
  })
})

describe('lib > date.js > formatStart', () => {
  it('should format start date correctly', () => {
    const str = formatStart('2020-02-26T13:39:37.655Z')
    expect(str).to.equal('Mercredi 26 Février 2020')
  })
})

describe('lib > date.js > formatPlage', () => {
  it('should format plage of date correctly', () => {
    const d = { startDate: '2020-02-26T13:39:37.655', endDate: '2020-03-30T10:39:37.655' }
    let str = formatPlage(d)
    expect(str).to.equal('Du 26/02 à 13:39 au 30/03 à 10:39')
    str = formatPlage(d, true)
    expect(str).to.equal('Du 26/02 à 13:39 au 30/03 à 10:39 (GMT-3)')
  })
})

describe('lib > date.js > days', () => {
  it('should get the correct list of days', () => {
    expect(days).to.eql([
      { label: 'Lundi', value: 'mon' },
      { label: 'Mardi', value: 'tue' },
      { label: 'Mercredi', value: 'wed' },
      { label: 'Jeudi', value: 'thu' },
      { label: 'Vendredi', value: 'fri' },
      { label: 'Samedi', value: 'sat' },
      { label: 'Dimanche', value: 'sun' }
    ])
  })
})
