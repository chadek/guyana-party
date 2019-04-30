import { b, bb } from '../bling'
import { axiosGet, data2HTML, sliceStr, addNewBtn, pagination } from '../utils'

function formatStatus (rawStatus) {
  switch (rawStatus) {
    case 'admin':
      return 'Admin'
    case 'pending_request':
      return "En attente d'approbation"
    default:
      return 'unknown'
  }
}

function groupCardFormat (item) {
  const name = sliceStr(item.name)
  const imgSrc = item.photo ? `/uploads/${item.photo}` : `/images/default.jpg`
  let status
  const uid = b('#uid')
  if (uid) {
    item.community.forEach(c => {
      if (c.user === uid.value) status = c.role
    })
  }
  const editLabel = `<a href="/organisms/${item.id}/edit">Modifier</a>`
  const archiveLabel = `<a href="/organism/${
    item.slug
  }?remove=true">Archiver</a>`
  const conf = status === 'admin' ? `${editLabel} | ${archiveLabel}` : ''
  const color = status === 'pending_request' ? 'style="color: orange;"' : ''

  return `
    <div class="card">
      <div class="card__header">
        <img src="${imgSrc}" alt="photo organisme">
        <div class="card__header--content">
          <p>
            <a href="/organism/${item.slug}#events">
              Voir évènements associés
            </a>
            <br><a href="/organism/${item.slug}#community">Voir communauté</a>
            <br>(${formatStatus(status)}) ${conf}
          </p>
        </div>
      </div>
      <div class="card__section">
        <p><a href="/organism/${item.slug}" ${color}>${name}</a></p>
      </div>
    </div>`
}

function getGroups (groupsDiv, page = 1) {
  if (!groupsDiv) return
  axiosGet(`/api/organisms?page=${page}`, data => {
    if (!data) return
    const currentPage = data.page
    const pages = data.pages
    const count = data.count
    const limit = data.limit

    // adding the count
    if (count) b('.groupsCount').innerHTML = ` (${count})`
    else b('.groupsCount').innerHTML = ''

    // Add the groups to the groups div container
    groupsDiv.innerHTML = data2HTML(data, groupCardFormat, addNewBtn(true))
    const paginationDiv = b('#groupsPagination')
    if (paginationDiv && count > limit) {
      paginationDiv.innerHTML = pagination(currentPage, pages)
      // Click on groups pagination
      bb('#groupsPagination .pageBtn').on('click', e => {
        let page = e.target.textContent
        if (page === '«' || page === `&laquo;`) {
          page = currentPage - 1
        } else if (page === '»' || page === `&raquo;`) {
          page = currentPage + 1
        }
        getGroups(groupsDiv, page)
      })
    }
    // Add click event on new button
    b('.card__new--group').on('click', () => (location.href = '/organisms/add'))
  })
}

export default getGroups
