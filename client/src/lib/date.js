import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz'
import fr from 'date-fns/locale/fr'

export const userTZ = () => {
  try {
    let offset = new Date().getTimezoneOffset()
    const o = Math.abs(offset)
    offset =
      (offset < 0 ? '+' : '-') +
      ('00' + Math.floor(o / 60)).slice(-2) +
      ':' +
      ('00' + (o % 60)).slice(-2)
    return tzList.filter(t => t.offset === offset)[0].tzCode
  } catch (error) {
    console.log(error)
    return 'Europe/London'
  }
}

export const toUTCIsoDate = (date, timeZone) => zonedTimeToUtc(date, timeZone).toISOString()

export const toZonedTime = (date, timeZone) => utcToZonedTime(date, timeZone)

export const dateToStr = (date, timeZone, formatStr = 'd MMM yyyy à HH:mm (zzz)') => {
  const locale = fr
  if (timeZone) return format(utcToZonedTime(date, timeZone), formatStr, { locale, timeZone })
  return format(new Date(date), formatStr, { locale })
}

export const formatStart = startDate => {
  const tz = userTZ()
  const d = dateToStr(startDate, tz, 'EEEE d MMMM yyyy').split(' ')
  let day = d[0]
  day = day.charAt(0).toUpperCase() + day.slice(1)
  const dayNb = d[1]
  let month = d[2]
  month = month.charAt(0).toUpperCase() + month.slice(1)
  const year = d[3]
  return `${day} ${dayNb} ${month} ${year}`
}

export const formatPlage = ({ startDate, endDate }, showUTC = false) => {
  const tz = userTZ()
  const start = dateToStr(startDate, tz, 'dd MM HH:mm (zzz)').split(' ')
  const end = dateToStr(endDate, tz, 'dd MM HH:mm').split(' ')
  const utc = showUTC ? ` ${start[3]}` : ''
  if (start[0] + start[1] === end[0] + end[1]) {
    return `Le ${start[0]}/${start[1]} de ${start[2]} à ${end[2]}${utc}`
  }
  return `Du ${start[0]}/${start[1]} à ${start[2]} au ${end[0]}/${end[1]} à ${end[2]}${utc}`
}

export const days = [
  { label: 'Lundi', value: 'mon' },
  { label: 'Mardi', value: 'tue' },
  { label: 'Mercredi', value: 'wed' },
  { label: 'Jeudi', value: 'thu' },
  { label: 'Vendredi', value: 'fri' },
  { label: 'Samedi', value: 'sat' },
  { label: 'Dimanche', value: 'sun' }
]

export const tzList = [
  {
    offset: '-11:00',
    label: '(GMT-11:00) Pago Pago',
    tzCode: 'Pacific/Pago_Pago'
  },
  {
    offset: '-10:00',
    label: '(GMT-10:00) Hawaii Time',
    tzCode: 'Pacific/Honolulu'
  },
  { offset: '-10:00', label: '(GMT-10:00) Tahiti', tzCode: 'Pacific/Tahiti' },
  {
    offset: '-09:00',
    label: '(GMT-09:00) Alaska Time',
    tzCode: 'America/Anchorage'
  },
  {
    offset: '-08:00',
    label: '(GMT-08:00) Pacific Time',
    tzCode: 'America/Los_Angeles'
  },
  {
    offset: '-07:00',
    label: '(GMT-07:00) Mountain Time',
    tzCode: 'America/Denver'
  },
  {
    offset: '-06:00',
    label: '(GMT-06:00) Central Time',
    tzCode: 'America/Chicago'
  },
  {
    offset: '-05:00',
    label: '(GMT-05:00) Eastern Time',
    tzCode: 'America/New_York'
  },
  {
    offset: '-04:00',
    label: '(GMT-04:00) Atlantic Time - Halifax',
    tzCode: 'America/Halifax'
  },
  {
    offset: '-03:00',
    label: '(GMT-03:00) Buenos Aires',
    tzCode: 'America/Argentina/Buenos_Aires'
  },
  {
    offset: '-02:00',
    label: '(GMT-02:00) Noronha',
    tzCode: 'America/Noronha'
  },
  { offset: '-01:00', label: '(GMT-01:00) Azores', tzCode: 'Atlantic/Azores' },
  { offset: '+00:00', label: '(GMT+00:00) London', tzCode: 'Europe/London' },
  { offset: '+01:00', label: '(GMT+01:00) Berlin', tzCode: 'Europe/Berlin' },
  {
    offset: '+02:00',
    label: '(GMT+02:00) Helsinki',
    tzCode: 'Europe/Helsinki'
  },
  {
    offset: '+03:00',
    label: '(GMT+03:00) Istanbul',
    tzCode: 'Europe/Istanbul'
  },
  { offset: '+04:00', label: '(GMT+04:00) Dubai', tzCode: 'Asia/Dubai' },
  { offset: '+04:30', label: '(GMT+04:30) Kabul', tzCode: 'Asia/Kabul' },
  {
    offset: '+05:00',
    label: '(GMT+05:00) Maldives',
    tzCode: 'Indian/Maldives'
  },
  {
    offset: '+05:30',
    label: '(GMT+05:30) India Standard Time',
    tzCode: 'Asia/Calcutta'
  },
  {
    offset: '+05:45',
    label: '(GMT+05:45) Kathmandu',
    tzCode: 'Asia/Kathmandu'
  },
  { offset: '+06:00', label: '(GMT+06:00) Dhaka', tzCode: 'Asia/Dhaka' },
  { offset: '+06:30', label: '(GMT+06:30) Cocos', tzCode: 'Indian/Cocos' },
  { offset: '+07:00', label: '(GMT+07:00) Bangkok', tzCode: 'Asia/Bangkok' },
  {
    offset: '+08:00',
    label: '(GMT+08:00) Hong Kong',
    tzCode: 'Asia/Hong_Kong'
  },
  {
    offset: '+08:30',
    label: '(GMT+08:30) Pyongyang',
    tzCode: 'Asia/Pyongyang'
  },
  { offset: '+09:00', label: '(GMT+09:00) Tokyo', tzCode: 'Asia/Tokyo' },
  {
    offset: '+09:30',
    label: '(GMT+09:30) Central Time - Darwin',
    tzCode: 'Australia/Darwin'
  },
  {
    offset: '+10:00',
    label: '(GMT+10:00) Eastern Time - Brisbane',
    tzCode: 'Australia/Brisbane'
  },
  {
    offset: '+10:30',
    label: '(GMT+10:30) Central Time - Adelaide',
    tzCode: 'Australia/Adelaide'
  },
  {
    offset: '+11:00',
    label: '(GMT+11:00) Eastern Time - Melbourne, Sydney',
    tzCode: 'Australia/Sydney'
  },
  { offset: '+12:00', label: '(GMT+12:00) Nauru', tzCode: 'Pacific/Nauru' },
  {
    offset: '+13:00',
    label: '(GMT+13:00) Auckland',
    tzCode: 'Pacific/Auckland'
  },
  {
    offset: '+14:00',
    label: '(GMT+14:00) Kiritimati',
    tzCode: 'Pacific/Kiritimati'
  }
]
