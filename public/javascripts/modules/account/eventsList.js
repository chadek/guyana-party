import { b, bb } from '../bling'
import {
  axiosGet,
  data2HTML,
  formatDateTime,
  sliceStr,
  addNewBtn,
  pagination
} from '../utils'

// The format of an event card
function eventCardFormat (item) {
  const imgSrc = item.photo ? `/uploads/${item.photo}` : `/images/default.jpg`
  let start = formatDateTime(item.start)
  let end = formatDateTime(item.end)
  start = `${start.date} à ${start.time}`
  end = `${end.date} à ${end.time}`
  const orgaSlug = item.organism.slug
  const orgaName = sliceStr(item.organism.name)
  const address = sliceStr(item.location.address, 90)
  const titleClass =
    item.status !== 'published' && item.status !== 'archived'
      ? 'class="unpublished-color"'
      : ''
  let privateEventLabel = '<strong>Evènement Archivé</strong>'
  let actionsLabel = ''
  if (item.status !== 'archived') {
    privateEventLabel = !item.public
      ? '<br><strong>Evènement privé</strong>'
      : ''
    const actions = `
      <a href="/events/${item.id}/edit">Modifier</a> |
      <a href="/event/${item.slug}?remove=true">Archiver</a>`
    actionsLabel =
      item.status !== 'published'
        ? `<br><strong class="unpublished-color">Non publié</strong> | ${actions}`
        : `<br>${actions}`
  }

  return `
    <div class="card">
      <div class="card__header">
        <img src="${imgSrc}" alt="photo évènement">
        <div class="card__header--content">
          <p>
            <strong>Organisateur :</strong>&nbsp<a href="/organism/${orgaSlug}">${orgaName}</a>
            <br><strong>Début :</strong>&nbsp${start}
            <br><strong>Fin :</strong>&nbsp${end}
            <br><strong>Adresse :</strong>&nbsp${address}
            ${privateEventLabel}
            ${actionsLabel}
          </p>
        </div>
      </div>
      <div class="card__section">
        <p>
          <a href="/event/${item.slug}" ${titleClass}>
            ${sliceStr(item.name, 25)}
          </a>
        </p>
      </div>
    </div>`
}

function getEvents (eventsDiv, orgaId = null, page = 1, archived = false) {
  if (!eventsDiv) return
  if (orgaId !== null && (!orgaId || !orgaId.value)) return
  const groupInUrl = orgaId ? `&orga=${orgaId.value}` : ''
  const archivedInUrl = archived ? `&archived=true` : ''
  axiosGet(`/api/events?page=${page}${groupInUrl}${archivedInUrl}`, data => {
    if (!data) return
    const currentPage = data.page
    const pages = data.pages
    const count = data.count
    const limit = data.limit

    // adding the count
    if (count) b('.eventsCount').innerHTML = ` (${count})`
    else b('.eventsCount').innerHTML = ''

    // Add the events to the events div container
    eventsDiv.innerHTML = data2HTML(data, eventCardFormat, addNewBtn())
    // Add the pagination
    const paginationDiv = b('#eventsPagination')
    if (paginationDiv && count > limit) {
      paginationDiv.innerHTML = pagination(currentPage, pages)
      // Click on events pagination
      bb('#eventsPagination .pageBtn').on('click', e => {
        let page = e.target.textContent
        if (page === '«' || page === `&laquo;`) {
          page = currentPage - 1
        } else if (page === '»' || page === `&raquo;`) {
          page = currentPage + 1
        }
        getEvents(eventsDiv, orgaId, page)
      })
    }
    // Add click event on new button
    b('.card__new--event').on('click', () => {
      location.href = `/events/add${orgaId ? `?orga=${orgaId.value}` : ''}`
    })
  })
}

export default getEvents
