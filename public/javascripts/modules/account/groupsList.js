import { B, BB } from '../bling'
import { axiosGet, data2HTML, sliceStr, addNewBtn, pagination } from '../utils'

function groupCardFormat (item) {
  const imgSrc = item.photo ? `/uploads/${item.photo}` : `/images/default.jpg`
  return `<div class="pure-u-1 u-lg-1-4 u-md-1-3 u-sm-1-2 l-content">
    <div class="card">
      <div class="card__header">
        <img src="${imgSrc}" alt="photo organisme">
        <div class="card__header--content">
          <p>
          ${item.type ? `<strong>Type d'organisme :</strong> ${item.type}` : ''}
          <br><a href="/organism/${
  item.slug
}#events">Voir évènements associés</a>
          <br><a href="/organism/${item.slug}#community">Voir communauté</a>
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

function getGroups (groupsDiv, page = 1) {
  if (!groupsDiv) return
  axiosGet(`/api/organisms?page=${page}`, data => {
    if (!data) return
    const currentPage = data.page
    const pages = data.pages
    const count = data.count
    const limit = data.limit

    if (count) B('.groupsCount').innerHTML = ` (${count})` // adding the count

    // Add the groups to the groups div container
    groupsDiv.innerHTML = data2HTML(data, groupCardFormat, addNewBtn(true))
    if (count > limit) {
      groupsDiv.innerHTML += pagination(currentPage, pages)
      // Click on groups pagination
      BB('#orgas .pageBtn').on('click', e => {
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
    B('.card__new--group').on('click', () => (location.href = '/organisms/add'))
  })
}

export default getGroups
