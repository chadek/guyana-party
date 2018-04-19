import { B, BB } from "./bling";
import { axiosGet, data2HTML, formatDateTime } from "./utils";

function openCard() {
  const cardHeader = BB(".card__header");
  cardHeader.on("mouseover", function() {
    this.children[0].classList.add("open");
    setTimeout(() => {
      if (this.children[0].classList.contains("open")) {
        this.children[0].classList.add("hidden");
      }
    }, 500);
  });
  cardHeader.on("mouseleave", function() {
    this.children[0].classList.remove("open");
    this.children[0].classList.remove("hidden");
  });
}

function getEventsList(eventsDiv) {
  if (!eventsDiv) return;
  axiosGet("/api/events", data => {
    if (data) {
      const format = item => {
        const imgSrc = item.photo ? `/uploads/${item.photo}` : `/images/default.jpg`;
        let start = formatDateTime(item.start);
        let end = formatDateTime(item.end);
        start = `${start.date} à ${start.time}`;
        end = `${end.date} à ${end.time}`;
        return `<div class="pure-u-1 u-lg-1-4 u-md-1-3 u-sm-1-2 l-content">
          <div class="card">
            <div class="card__header">
              <img src="${imgSrc}" alt="photo évènement">
              <div class="card__header--content">
                <p><strong>Organisateur :</strong> <a href="/organism/${item.organism.slug}">${item.organism.name}</a>
                <br><strong>Début :</strong> ${start}
                <br><strong>Fin :</strong> ${end}
                <br><strong>Adresse :</strong> ${item.location.address}</p>
              </div>
            </div>
            <div class="card__section">
              <p><a href="/event/${item.slug}">${item.name}</a></p>
            </div>
          </div>
        </div>`;
      };
      const concat = `<div class="pure-u-1 u-lg-1-4 u-md-1-3 u-sm-1-2 l-content">
        <div class="card card__new card__new--event" title="Ajouter un évènement"></div>
      </div>`;
      eventsDiv.innerHTML = data2HTML(data, format, concat);
      B(".card__new--event").on("click", () => (location.href = "/events/add"));
      openCard();
    }
  });
}

function getOrgasList(orgasDiv) {
  if (!orgasDiv) return;
  axiosGet("/api/organisms", data => {
    if (data) {
      const format = item => {
        const imgSrc = item.photo ? `/uploads/${item.photo}` : `/images/default.jpg`;
        return `<div class="pure-u-1 u-lg-1-4 u-md-1-3 u-sm-1-2 l-content">
          <div class="card">
            <div class="card__header">
              <img src="${imgSrc}" alt="photo organisme">
              <div class="card__header--content">
                <p><strong>Type d'organisme :</strong> ${item.type}
                <br><a href="/organism/${item.slug}">Voir évènements associés</a>
                <br><a href="/organism/${item.slug}">Voir communauté</a>
                <br><strong>Adresse :</strong> ${item.location.address}
                <br><strong>Souscription :</strong> ${item.subscription ? item.subscription : "free"}
                <br>(<a href="/souscriptions">Passer en PRO !</a>)</p>
              </div>
            </div>
            <div class="card__section">
              <p><a href="/organism/${item.slug}">${item.name}</a></p>
            </div>
          </div>
        </div>`;
      };
      const concat = `<div class="pure-u-1 u-lg-1-4 u-md-1-3 u-sm-1-2 l-content">
        <div class="card card__new card__new--organism" title="Ajouter un organisme"></div>
      </div>`;
      orgasDiv.innerHTML = data2HTML(data, format, concat);
      B(".card__new--organism").on("click", () => (location.href = "/organisms/add"));
      openCard();
    }
  });
}

function getEventsFromOrga(orgaEventsDiv) {
  if (!orgaEventsDiv) return;
  const orgaId = B("#orga-id");
  if (!orgaId || !orgaId.value) return;
  axiosGet(`/api/events?orga=${orgaId.value}`, data => {
    if (data) {
      const format = item => {
        const imgSrc = item.photo ? `/uploads/${item.photo}` : `/images/default.jpg`;
        let start = formatDateTime(item.start);
        let end = formatDateTime(item.end);
        start = `${start.date} à ${start.time}`;
        end = `${end.date} à ${end.time}`;
        return `<div class="pure-u-1 u-lg-1-4 u-md-1-3 u-sm-1-2 l-content">
          <div class="card">
            <div class="card__header">
              <img src="${imgSrc}" alt="photo évènement">
              <div class="card__header--content">
                <p><strong>Organisateur :</strong> <a href="/organism/${item.organism.slug}">${item.organism.name}</a>
                <br><strong>Début :</strong> ${start}
                <br><strong>Fin :</strong> ${end}
                <br><strong>Adresse :</strong> ${item.location.address}</p>
              </div>
            </div>
            <div class="card__section">
              <p><a href="/event/${item.slug}">${item.name}</a></p>
            </div>
          </div>
        </div>`;
      };
      const concat = `<div class="pure-u-1 u-lg-1-4 u-md-1-3 u-sm-1-2 l-content">
        <div class="card card__new card__new--event" title="Ajouter un évènement"></div>
      </div>`;
      orgaEventsDiv.innerHTML = data2HTML(data, format, concat);
      B(".card__new--event").on("click", () => (location.href = `/events/add?orga=${orgaId.value}`));
      openCard();
    }
  });
}

function initOrgaDropdown(orgasSelect) {
  if (!orgasSelect) return;
  const orgaId = B("#orga-id");
  if (!orgaId || !orgaId.value) return;
  axiosGet("/api/organisms", data => {
    if (data) {
      const format = item => {
        if (orgaId.value && item._id === orgaId.value)
          return `<option value="${item._id}" selected>${item.name}</option>`;
        return `<option value="${item._id}">${item.name}</option>`;
      };
      orgasSelect.innerHTML = data2HTML(data, format, "");
    }
  });
}

function loadEventsOrgasList(eventsDiv, orgaEventsDiv, orgasDiv, orgasSelect) {
  getEventsList(eventsDiv);
  getEventsFromOrga(orgaEventsDiv);
  getOrgasList(orgasDiv);
  initOrgaDropdown(orgasSelect);
}

export default loadEventsOrgasList;
