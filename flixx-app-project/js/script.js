const global = {
  currentPage: window.location.pathname, // the path and filename of the current webpage
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiURL: "https://api.themoviedb.org/3/",
    options: {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTk5MjEwZGZmZmVkZGFhYjQ5NDgxZmZjOTVkOGE5MCIsIm5iZiI6MTczMTgxMTA5Mi4yNzE1MDIzLCJzdWIiOiI2NzM4NDM4MjYyNGE4NWI4ODk5ZTk3NTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ydmdDZFl9dtXHyl2RC3R153Tf5vByzm3dTtwqW8O-h8",
      },
    },
  },
};

// movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData("trending/movie/week"); // {} for result makes it return the array rightaway instead of object
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML =
      // checking if there's movie poster
      `<a href="movie-details.html?id=${movie.id}">
         ${
           movie.poster_path
             ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
            />`
             : `<img src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
            />`
         }
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>
  `;

    document.querySelector("#popular-movies").appendChild(div);
  });
}

// TV shows
async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="tv-details.html?id=${show.id}">
         ${
           show.poster_path
             ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
            />`
             : `<img src="images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
            />`
         }
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">
            <small class="text-muted">Aired: ${show.first_air_date}</small>
          </p>
        </div>
  `;

    document.querySelector("#popular-shows").appendChild(div);
  });
}

// display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];

  const movie = await fetchAPIData(`movie/${movieId}`);

  // overlay for background image
  displayBackgroundImage("movie", movie.backdrop_path);

  // top
  const divTop = document.createElement("div");
  divTop.classList.add("details-top");
  divTop.innerHTML = `
    <div>
    ${
      movie.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    class="card-img-top"
    alt="${movie.original_title}"
    />`
        : `<img src="images/no-image.jpg"
     class="card-img-top"
     alt="${movie.original_title}"
     />`
    }
   </div>
   <div>
          <h2>${movie.original_title}</h2>
          <p>
            <i class="fas fa-star text-primary"></i>
            ${movie.vote_average.toFixed(1)} / 10
          </p>
          <p class="text-muted">Release Date: ${movie.release_date}</p>
          <p>
            ${movie.overview}
          </p>
          <h5>Genres</h5>
          <ul class="list-group">
           ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
          </ul>
          <a href="${movie.homepage}"
             target="_blank"
             class="btn">Visit Movie Homepage</a>
        </div>
      </div>`;

  // bottom
  const divBottom = document.createElement("div");
  divBottom.classList.add("details-bottom");
  divBottom.innerHTML = `
  <h2>Movie Info</h2>
        <ul>
          <li><span class="text-secondary">Budget:</span> $${movie.budget.toLocaleString()}</li>
          <li><span class="text-secondary">Revenue:</span> $${movie.revenue.toLocaleString()}</li>
          <li><span class="text-secondary">Runtime:</span> ${
            movie.runtime
          } minutes</li>
          <li><span class="text-secondary">Status:</span> ${movie.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">
      ${movie.production_companies
        .map((company) => `${company.name}`)
        .join(", ")}
        </div>
  `;

  // join() creates and returns a new string by concatenating all of the elements in an array

  document.querySelector("#movie-details").appendChild(divTop);
  document.querySelector("#movie-details").appendChild(divBottom);
}

// tv shows details
async function displayTvDetails() {
  const tvId = window.location.search.split("=")[1];

  const tv = await fetchAPIData(`tv/${tvId}`);

  // overlay for background image
  displayBackgroundImage("tv", tv.backdrop_path);

  // top
  const divTop = document.createElement("div");
  divTop.classList.add("details-top");
  divTop.innerHTML = `
    <div>
    ${
      tv.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
    class="card-img-top"
    alt="${tv.name}"
    />`
        : `<img src="images/no-image.jpg"
     class="card-img-top"
     alt="${tv.name}"
     />`
    }
   </div>
   <div>
          <h2>${tv.name}</h2>
          <p>
            <i class="fas fa-star text-primary"></i>
            ${tv.vote_average.toFixed(1)} / 10
          </p>
          <p class="text-muted">Release Date: ${tv.first_air_date}</p>
          <p>
            ${tv.overview}
          </p>
          <h5>Genres</h5>
          <ul class="list-group">
           ${tv.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
          </ul>
          <a href="${tv.homepage}"
             target="_blank"
             class="btn">Visit Show Homepage</a>
        </div>
      </div>`;

  // bottom
  const divBottom = document.createElement("div");
  divBottom.classList.add("details-bottom");
  divBottom.innerHTML = `
  <h2>Show Info</h2>
       <ul>
          <li><span class="text-secondary">Number Of Episodes:</span> ${
            tv.episode_run_time
          }</li>
          <li>
            <span class="text-secondary">Last Episode To Air:</span> ${
              tv.last_episode_to_air.name
            }
          </li>
          <li><span class="text-secondary">Status:</span> ${tv.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">
      ${tv.production_companies.map((company) => `${company.name}`).join(", ")}
        </div>
  `;

  // join() creates and returns a new string by concatenating all of the elements in an array

  document.querySelector("#show-details").appendChild(divTop);
  document.querySelector("#show-details").appendChild(divBottom);
}

// display backdrop on details pages
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.2";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

// search movies/shows
/*
<input type="text"
       name="search-term"
       id="search-term"
       placeholder="Enter search term"
       />
name = "search-term" makes the search url: http://127.0.0.1:5500/search.html?type=movie&search-term=spiderman

<input type="radio" id="movie" name="type" value="movie" checked />
url: type=movie
*/
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No results found");
      return;
    }

    displaySearchResults(results);
    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter a search term");
  }
}

// display search results
function displaySearchResults(results) {
  // clear previous results
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<a href="${global.search.type}-details.html?id=${
      result.id
    }">
         ${
           result.poster_path
             ? `<img src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
            class="card-img-top"
            alt="${global.search.type === "movie" ? result.title : result.name}"
            />`
             : `<img src="images/no-image.jpg"
            class="card-img-top"
            alt="${global.search.type === "movie" ? result.title : result.name}"
            />`
         }
        <div class="card-body">
          <h5 class="card-title">${
            global.search.type === "movie" ? result.title : result.name
          }</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${
              global.search.type === "movie"
                ? result.release_date
                : result.first_air_date
            }</small>
          </p>
        </div>
  `;

    document.querySelector(
      "#search-results-heading"
    ).innerHTML = `<h2>${results.length} of ${global.search.totalResults} for ${global.search.term}</h2>`;

    document.querySelector("#search-results").appendChild(div);
  });

  displayPagination();
}

// display pagination
function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
  <button class="btn btn-primary"
                id="prev">Prev</button>
        <button class="btn btn-primary"
                id="next">Next</button>
        <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
        `;

  document.querySelector("#pagination").appendChild(div);

  // disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

  // disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  // next page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });

  // prev page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });
}

// display slider movies
async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = ` 
     <a href="movie-details.html?id=${movie.id}">
     <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
         alt="${movie.original_title}" />
     </a>
     <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
        1
      )} / 10
     </h4>
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
}

// check swiper API https://swiperjs.com/swiper-api
function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteracton: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_URL = global.api.apiURL;
  const options = global.api.options;

  showSpinner();

  const response = await fetch(`${API_URL}${endpoint}?language=en-US`, options);
  const data = await response.json();

  hideSpinner();

  return data;
}

async function searchAPIData() {
  const API_URL = global.api.apiURL;
  const options = global.api.options;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?language=en-US&query=${global.search.term}&page=${global.search.page}`,
    options
  );
  const data = await response.json();

  hideSpinner();

  return data;
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

highlightActiveLink();

// show alert
// by default className is error
function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);
  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

// init app
function init() {
  // check which page we're on
  switch (global.currentPage) {
    case "/index.html":
    case "/":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayTvDetails();
      break;
    case "/search.html":
      search();
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
