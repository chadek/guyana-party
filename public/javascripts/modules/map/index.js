;(() => {
  const mapDiv = document.querySelector('#map')
  if (!mapDiv) return

  const single = document.querySelector('.single')

  if (single) {
    require('./singleMap')
  }
})()
