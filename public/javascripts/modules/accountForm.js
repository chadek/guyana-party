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

function loadEvents(eventsDiv) {
  if (!eventsDiv) return;
  // $("[data-mobile-app-toggle] .button").click(function() {
  //   $(this)
  //     .siblings()
  //     .removeClass("is-active");
  //   $(this).addClass("is-active");
  // });
  axios
    .get(`/api/events`)
    .then(res => {
      if (res.data) {
        eventsDiv.innerHTML = dompurify.sanitize(data2HTML(res.data, "event"));
        B(".card__new--event").on("click", () => location.href = "/events/add");
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function loadOrgas(orgasDiv) {
  if (!orgasDiv) return;
  axios
    .get(`/api/organisms`)
    .then(res => {
      if (res.data) {
        orgasDiv.innerHTML = dompurify.sanitize(data2HTML(res.data, "organism"));
        B(".card__new--organism").on("click", () => location.href = "/organisms/add");
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function accountForm(events, orgas) {
  loadEvents(events);
  loadOrgas(orgas);
}

export default accountForm;
