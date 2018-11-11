import { B, BB } from '../bling'
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
  const status =
    item.status !== 'published'
      ? '<br><strong class="unpublished-color">Non publié</strong> |'
      : '<br>'
  return `<div class="pure-u-1 u-lg-1-4 u-md-1-3 u-sm-1-2 l-content">
        <div class="card">
          <div class="card__header">
            <img src="${imgSrc}" alt="photo évènement">
            <div class="card__header--content">
              <p><strong>Organisateur :</strong> <a href="/organism/${orgaSlug}">${orgaName}</a>
              <br><strong>Début :</strong> ${start}
              <br><strong>Fin :</strong> ${end}
              <br><strong>Adresse :</strong> ${address}
              ${
  item.status !== 'archived'
    ? `
                ${!item.public ? '<br><strong>Evènement privé</strong>' : ''}
                ${status}
                <a href="/events/${
  item.id
}/edit">Modifier</a> | <a href="/event/${
  item.slug
}?remove=true">Archiver</a>
              `
    : '<br><strong>Archivé</strong>'
}
              </p>
            </div>
          </div>
          <div class="card__section">
            <p><a ${
  item.status !== 'published' && item.status !== 'archived'
    ? 'class="unpublished-color"'
    : ''
} href="/event/${item.slug}">${sliceStr(item.name)}</a></p>
          </div>
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

    if (count) B('.eventsCount').innerHTML = ` (${count})` // adding the count

    // Add the events to the events div container
    eventsDiv.innerHTML = data2HTML(data, eventCardFormat, addNewBtn())
    // Add the pagination
    if (count > limit) {
      eventsDiv.innerHTML += pagination(currentPage, pages)
      // Click on events pagination
      BB('#events .pageBtn').on('click', e => {
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
    B('.card__new--event').on('click', () => {
      location.href = `/events/add${orgaId ? `?orga=${orgaId.value}` : ''}`
    })
  })
}

export default getEvents
