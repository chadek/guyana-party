import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz'
import fr from 'date-fns/locale/fr'
import tzList from './tzList'

export const userTZ = () => {
  try {
    let offset = new Date().getTimezoneOffset()
    const o = Math.abs(offset)
    offset = `${(offset < 0 ? '+' : '-') + `00${Math.floor(o / 60)}`.slice(-2)}:${`00${o % 60}`.slice(-2)}`
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
