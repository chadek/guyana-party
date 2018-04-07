import axios from "axios";
import dompurify from "dompurify";
import { B } from "./bling";

function data2HTML(data, route) {
  return data.items
    .map(item => {
      const imgSrc = item.photo ? `/uploads/${item.photo}` : `/images/default.jpg`;
      return `<div class="columns large-3 medium-6 small-12 end">
        <div class="card">
          <img src="${imgSrc}" alt="photo">
          <div class="card-section">
            <p><a href="/${route}/${item.slug}">${item.name}</a></p>
          </div>
        </div>
      </div>`;
    })
    .join('').concat(`<div class="columns large-3 medium-6 small-12 end">
      <div class="card card__new card__new--${route}" title="Ajouter"></div>
    </div>`);
}

function getOrgaEvents(orgaEventsDiv) {
  if (!orgaEventsDiv) return;
  const orgaId = B("#orga-id");
  if(!orgaId.value) return;
  axios
    .get(`/api/events?orga=${orgaId.value}`)
    .then(res => {
      if (res.data) {
        orgaEventsDiv.innerHTML = dompurify.sanitize(data2HTML(res.data, "event"));
        B(".card__new--event").on("click", () => location.href = `/events/add?orga=${orgaId.value}`);
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function loadEvents(events, orgas, orgaEvents) {
  getOrgaEvents(orgaEvents);
}

export default loadEvents;
