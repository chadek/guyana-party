/* Tools for controllers */
var nextDay = require('next-day');

exports.getPagedItems = async (model, page, limit, find, projection, sort) => {
  page = parseInt(page)
  limit = parseInt(limit)
  if (isNaN(page) || isNaN(limit)) {
    return {
      isErrorPage: true,
      error: 'page and limit parameters must be integers'
    }
  }
  const skip = page * limit - limit
  const itemsPromise = model
    .find(find, projection)
    .skip(skip)
    .limit(limit)
    .sort(sort)
  const [items, count] = await Promise.all([itemsPromise, model.count(find)])
  return {
    items,
    page,
    pages: Math.ceil(count / limit),
    count,
    limit,
    isErrorPage: !items.length && skip
  }
}

exports.confirmOwner = function (model, user) {
  if (!user || !model.author.equals(user._id)) {
    throw Error('Vous ne pouvez pas effectuer cet action !')
  }
}

exports.asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function formatEventStartEnd (isoStart,isoEnd) {
  let start = new Date(isoStart)
  let end = new Date(isoEnd)
  let month = start.getMonth()+1 
  let srtStartDate = `Le ${('0' + start.getDate()).slice(-2)}/${(
    '0' + month 
  ).slice(-2)}/${start.getFullYear()} de ${('0' + start.getHours()).slice(
    -2
    )}:${('0' + start.getMinutes()).slice(-2)} à ${('0' + end.getHours()).slice(
      -2
      )}:${('0' + end.getMinutes()).slice(-2)}`

  // return `Le ${('0' + start.getDate()).slice(-2)}/${(
  //   '0' + start.getMonth()
  // ).slice(-2)}/${start.getFullYear()} à ${('0' + start.getHours()).slice(
  //   -2
  // )}:${('0' + start.getMinutes()).slice(-2)}`
  return srtStartDate
}

exports.lookForNextOcurring = function(event){
  var NextDatesInTheWeek = []
  var nextdate
  const today = new Date()
  const end = new Date(event.end)

  console.log("Date de début : " + event.start)
  // console.log(event)
  var time = new Date(event.start)

  event.occurring.forEach(day =>{
    

    nextdate = nextDay(today, day)
    console.log(nextdate)
    var datetoiso = new Date(nextdate.date.toISOString())
    var bonneD = new Date(datetoiso.getFullYear(), datetoiso.getMonth(), datetoiso.getDate(), time.getHours(), time.getMinutes(), time.getMilliseconds(), time.getTimezoneOffset() )

    if (bonneD <= end){
      NextDatesInTheWeek.push(bonneD)
    }
    
  })

  if (NextDatesInTheWeek.length >= 1){
    NextDatesInTheWeek.sort(function(a,b){return a.getTime() - b.getTime()});
  }
  return formatEventStartEnd(NextDatesInTheWeek[0],event.end)
  // return "blabla"
}
