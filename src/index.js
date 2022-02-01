import "./assets/styles/main.scss";
import * as bootstrap from "bootstrap";
import Filterizr from "filterizr";
import Splide from "@splidejs/splide";

(function () {
  // Get data of team from json by fetch
  const teamData = async (start, pageLoad) => {
    const response = await fetch("http://localhost:8080/sailor_team.json");
    const data = await response.json();
    return data.slice(start, pageLoad);
  };
  let initPage = 0;

  const teamList = document.querySelector(".grid");

  const filterizrOptions = {
    spinner: {
      // This is the only mandatory setting if you simply wish
      // to enable the built-in spinner
      enabled: true,
      // Further (optional) customization options.
      fillColor: '#2184D0',
      styles: {
        height: '75px',
        margin: '0 auto',
        width: '75px',
        'z-index': 2,
      },
    }
  };
  // initial filterizr function
  const initialize = () => {
    let filterizr = new Filterizr(".grid",filterizrOptions);
    filterizr.setOptions({ layout: "sameSize" });
    filterizr.setOptions({
      callbacks: {
        onInit: function () {
          hoverHandler();
        },
        onFilteringEnd: function () {
          hoverHandler();
        },
      },
    });
  };

  // Initial teams grid
  const initializeTeams = async () => {
    const data = await teamData(0, 15);

    data.forEach((member) => {
      teamList.appendChild(createItem(member));
    });
    initialize();
  };
  initializeTeams();

  // Append item in teams grid
  const appendTeam = async (page) => {
    let start = page * 15;
    const data = await teamData(start, start + 15);
    data.forEach((member) => {
      let filterizr = new Filterizr(".grid");
      filterizr.insertItem(createItem(member));
    });
  };

  // Load more button handler
  document.querySelector("#load-more").addEventListener("click", () => {
    initPage += 1;
    appendTeam(initPage);
  });

  // Create item in teams grid
  const createItem = (item) => {
    const teamItem = document.createElement("div");
    teamItem.classList.add("team-item");
    teamItem.classList.add("filtr-item");
    let category = "";
    item.duty_slugs.forEach((duty, index) => {
      if (index === 0) {
        category = duty;
      } else {
        category = category + ", " + duty;
      }
    });
    teamItem.setAttribute("data-category", category);
    teamItem.innerHTML = `
          <div class="item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="item-info">
            <div class="item-info-text">
              <h5  class="fw-bold">${item.name}</h5>
              <p>${item.duties}</p>
            </div>
          </div>
        `;
    return teamItem;
  };

  // Hover handler on resize
  window.addEventListener("resize", hoverHandler);

  // Hover handler
  function hoverHandler() {
    const items = document.querySelectorAll(".filtr-item");
    // using settimeout to make sure that the hover event is triggered after the filterizr is initialized
    setTimeout(() => {
      items.forEach((item) => {
        item.classList.remove("hover-right");
        let pos = item.getBoundingClientRect();
        let windowWidth = window.innerWidth;
        if (windowWidth - pos.right <= pos.width) {
          item.classList.add("hover-right");
        }
      });
    }, 200);
  }

  // Splide slider handler
  let splide = new Splide(".splide", {
    perPage: 4,
    gap: "1rem",
    pagination: false,
    breakpoints: {
      992: {
        perPage: 3,
      },
      768: {
        perPage: 2,
        gap: ".7rem",
      },
      480: {
        perPage: 1,
        gap: ".7rem",
      },
    },
  });

  // Mounting splide slider
  splide.mount();

  // Slider counter handler
  let slideCarousel = document.querySelector(".carousel");
  slideCarousel.addEventListener("slid.bs.carousel", function () {
    let items = document.querySelectorAll(".carousel-item");
    let activeItemIndex = Array.from(items).findIndex((item) =>
      item.classList.contains("active")
    );
    let num = document.querySelector(".num");
    num.innerHTML = `${activeItemIndex + 1}/${items.length}`;
  });
})();
