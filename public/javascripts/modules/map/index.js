;(() => {
  const mapDiv = document.getElementById('map')
  if (!mapDiv) return
  const single = document.querySelector('.single')
  if (single) {
    require('./singleMap')
  } else {
    require('./eventsMap')
  }
})()
