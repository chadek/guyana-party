import { B } from "./bling";
import { axiosGet, data2HTML } from "./utils";

function getEventsList(eventsDiv) {
  if (!eventsDiv) return;
  axiosGet("/api/events", data => {
    if (data) {
      const format = item => {
        const imgSrc = item.photo ? `/uploads/${item.photo}` : `/images/default.jpg`;
        return `<div class="cell large-3 medium-4 small-6">
          <div class="card">
            <div class="card__header">
              <img src="${imgSrc}" alt="photo event">
            </div>
            <div class="card-section">
              <p><a href="/event/${item.slug}">${item.name}</a></p>
            </div>
          </div>
        </div>`;
      };
      const concat = `<div class="cell large-3 medium-4 small-6 end">
        <div class="card card__new card__new--event" title="Ajouter un évènement"></div>
      </div>`;
      eventsDiv.innerHTML = data2HTML(data, format, concat);
      B(".card__new--event").on("click", () => (location.href = "/events/add"));
    }
  });
}

function getOrgasList(orgasDiv) {
  if (!orgasDiv) return;
  axiosGet("/api/organisms", data => {
    if (data) {
      const format = item => {
        const imgSrc = item.photo ? `/uploads/${item.photo}` : `/images/default.jpg`;
        return `<div class="cell large-3 medium-4 small-6">
          <div class="card">
            <div class="card__header">
              <img src="${imgSrc}" alt="photo organisme">
            </div>
            <div class="card-section">
              <p><a href="/organism/${item.slug}">${item.name}</a></p>
            </div>
          </div>
        </div>`;
      };
      const concat = `<div class="cell large-3 medium-4 small-6 end">
        <div class="card card__new card__new--organism" title="Ajouter un organisme"></div>
      </div>`;
      orgasDiv.innerHTML = data2HTML(data, format, concat);
      B(".card__new--organism").on("click", () => (location.href = "/organisms/add"));
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
        return `<div class="cell large-3 small-6">
          <div class="card">
            <div class="card__header">
              <img src="${imgSrc}" alt="photo event">
            </div>
            <div class="card-section">
              <p><a href="/event/${item.slug}">${item.name}</a></p>
            </div>
          </div>
        </div>`;
      };
      const concat = `<div class="cell large-3 small-6 end">
        <div class="card card__new card__new--event" title="Ajouter un évènement"></div>
      </div>`;
      orgaEventsDiv.innerHTML = data2HTML(data, format, concat);
      B(".card__new--event").on("click", () => (location.href = `/events/add?orga=${orgaId.value}`));
    }
  });
}

function initOrgaDropdown(orgasSelect) {
  if(!orgasSelect) return;
  const orgaId = B("#orga-id");
  if (!orgaId || !orgaId.value) return;
  axiosGet("/api/organisms", data => {
    if (data) {
      const format = item => {
        if(orgaId.value && item._id === orgaId.value)
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
