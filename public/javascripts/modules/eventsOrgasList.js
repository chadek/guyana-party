import { B, BB } from './bling'
import { axiosGet, data2HTML, formatDateTime, sliceStr } from './utils'

function openCard () {
  const cardHeader = BB('.card__header')
  cardHeader.on('mouseover', function () {
    this.children[0].classList.add('open')
    setTimeout(() => {
      if (this.children[0].classList.contains('open')) {
        this.children[0].classList.add('hidden')
      }
    }, 500)
  })
  cardHeader.on('mouseleave', function () {
    this.children[0].classList.remove('open')
    this.children[0].classList.remove('hidden')
  })
}

// EVENTS
function getEventsList (eventsDiv) {
  getEvents(eventsDiv)
}

// ORGANISMS
function getOrgasList (orgasDiv) {
  if (!orgasDiv) return
  axiosGet('/api/organisms', data => {
    if (data) {
      const format = item => {
        const imgSrc = item.photo
          ? `/uploads/${item.photo}`
          : `/images/default.jpg`
        return `<div class="pure-u-1 u-lg-1-4 u-md-1-3 u-sm-1-2 l-content">
          <div class="card">
            <div class="card__header">
              <img src="${imgSrc}" alt="photo organisme">
              <div class="card__header--content">
                <p>
                ${
  item.type
    ? `<strong>Type d'organisme :</strong> ${item.type}`
    : ''
}
                <br><a href="/organism/${
  item.slug
}#events">Voir évènements associés</a>
                <br><a href="/organism/${
  item.slug
}#community">Voir communauté</a>
                ${
  item.location.address
    ? `<br><strong>Adresse :</strong> ${item.location.address}`
    : ''
}
                <!--<br><strong>Souscription :</strong> ${
  item.subscription ? item.subscription : 'free'
}
                <br>(<a href="/souscriptions">Passer en PRO !</a>)-->
                <br><a href="/organisms/${
  item.id
}/edit">Modifier</a> | <a href="/organism/${
  item.slug
}?remove=true">Archiver</a></p>
              </div>
            </div>
            <div class="card__section">
              <p><a href="/organism/${item.slug}">${sliceStr(item.name)}</a></p>
            </div>
          </div>
        </div>`
      }
      const concat = `<div class="pure-u-1 u-lg-1-4 u-md-1-3 u-sm-1-2 l-content">
        <div class="card card__new card__new--organism" title="Ajouter un organisme"></div>
      </div>`
      orgasDiv.innerHTML = data2HTML(data, format, concat)
      B('.card__new--organism').on(
        'click',
        () => (window.location.href = '/organisms/add')
      )
      openCard()
    }
  })
}

// EVENTS in an organism
function getEventsFromOrga (orgaEventsDiv) {
  getEvents(orgaEventsDiv, B('#orga-id'))
}

// Get the events
function getEvents (eventsDiv, orgaId = null, page = 1) {
  if (!eventsDiv) return
  if (orgaId !== null && (!orgaId || !orgaId.value)) return
  axiosGet(
    `/api/events?page=${page}${orgaId ? `&orga=${orgaId.value}` : ''}`,
    data => {
      if (data) {
        const currentPage = data.page
        const pages = data.pages
        const count = data.count
        const limit = data.limit

        B('.eventsCount').innerHTML = ` (${count})`

        const format = item => {
          const imgSrc = item.photo
            ? `/uploads/${item.photo}`
            : `/images/default.jpg`
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
              ${!item.public ? '<br><strong>Evènement privé</strong>' : ''}
              ${status}
              <a href="/events/${
  item.id
}/edit">Modifier</a> | <a href="/event/${
  item.slug
}?remove=true">Archiver</a></p>
            </div>
          </div>
          <div class="card__section">
            <p><a ${
  item.status !== 'published' ? 'class="unpublished-color"' : ''
} href="/event/${item.slug}">${sliceStr(item.name)}</a></p>
          </div>
        </div>
      </div>`
        }
        const concat = `<div class="pure-u-1 u-lg-1-4 u-md-1-3 u-sm-1-2 l-content"><div class="card card__new card__new--event" title="Ajouter un évènement"></div></div>`
        eventsDiv.innerHTML = `<div>${data2HTML(data, format, concat)}</div>`
        if (count > limit) {
          eventsDiv.innerHTML += pagination(currentPage, pages)
          // Click on events pagination
          BB('.events .pageBtn').on('click', e => {
            let page = e.target.textContent
            if (page === '«' || page === `&laquo;`) {
              page = currentPage - 1
            } else if (page === '»' || page === `&raquo;`) {
              page = currentPage + 1
            }
            getEvents(eventsDiv, orgaId, page)
          })
        }
        B('.card__new--event').on(
          'click',
          () =>
            (window.location.href = `/events/add${
              orgaId ? `?orga=${orgaId.value}` : ''
            }`)
        )
        openCard()
      }
    }
  )
}

function pagination (currentPage, pages) {
  let content = `<div class="pagination text-center"><ul>`
  if (currentPage > 1) {
    content += `<li class="pageBtn" title="page précédente">&laquo;</li>`
  }
  for (let i = 1; i <= pages; i++) {
    content += `<li class="${
      i === currentPage ? 'active' : 'pageBtn'
    }" title="page ${i}">${i}</li>`
  }
  if (currentPage < pages) {
    content += `<li class="pageBtn" title="page suivante">&raquo;</li>`
  }
  return `${content}</ul></div>`
}

// Organisms dropdown in event edit page
function initOrgaDropdown (orgasSelect) {
  if (!orgasSelect) return
  const orgaId = B('#orga-id')
  // if (!orgaId || !orgaId.value) return;
  axiosGet('/api/organisms', data => {
    if (data) {
      const format = item => {
        return `<option value="${item._id}"${
          orgaId.value && item._id === orgaId.value ? ' selected' : ''
        }>${sliceStr(item.name, 30)}</option>`
      }
      orgasSelect.innerHTML = data2HTML(data, format, '')
    }
  })
}

// Main function
function loadEventsOrgasList (eventsDiv, orgaEventsDiv, orgasDiv, orgasSelect) {
  getEventsList(eventsDiv)
  getEventsFromOrga(orgaEventsDiv)
  getOrgasList(orgasDiv)
  initOrgaDropdown(orgasSelect)
}

export default loadEventsOrgasList
