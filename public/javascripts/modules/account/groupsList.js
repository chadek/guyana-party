import { b, bb } from '../bling'
import { axiosGet, data2HTML, sliceStr, addNewBtn, pagination } from '../utils'

function groupCardFormat (item) {
  const imgSrc = item.photo ? `/uploads/${item.photo}` : `/images/default.jpg`
  const typeLabel = item.type
    ? `<strong>Type d'organisme :</strong> ${item.type}`
    : ''
  const addressLabel = item.location.address
    ? `<br><strong>Adresse :</strong> ${item.location.address}`
    : ''
  const editLabel = `<a href="/organisms/${item.id}/edit">Modifier</a>`
  const archiveLabel = `
    <a href="/organism/${item.slug}?remove=true">Archiver</a>`

  return `
    <div class="card">
      <div class="card__header">
        <img src="${imgSrc}" alt="photo organisme">
        <div class="card__header--content">
          <p>
            ${typeLabel}<br>
            <a href="/organism/${item.slug}#events">
              Voir évènements associés
            </a>
            <br><a href="/organism/${item.slug}#community">Voir communauté</a>
            ${addressLabel}
            <br>${editLabel} | ${archiveLabel}
          </p>
        </div>
      </div>
      <div class="card__section">
        <p><a href="/organism/${item.slug}">${sliceStr(item.name)}</a></p>
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
