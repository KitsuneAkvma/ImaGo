import Notiflix, { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

// API stuff
const API_KEY = '32683324-b0ce690598d4af74b245f496c';
const API_URL = 'https://pixabay.com/api/?key=';

// DOM elements
const searchBar = document.querySelector(`
[name="search-bar-header"]`);
const imagesDisplay = document.querySelector('.main-content');
const searchIcon = document.querySelector('.icon-search');
const loadMoreBtn = document.querySelector('.footer__load-more');

// Global Variables
let currentPage = 1;
let pagesLeft = 0;
////////////////////////////

async function fetchMain() {
  const searchedKey = searchBar.value;
  imagesDisplay.innerHTML = ' ';
  ////////////////////////////
  await axios
    .get(
      `${API_URL}${API_KEY}&q=${searchedKey}&per_page=40&page=${currentPage}`
    )
    .then(response => {
      const hits = response.data.hits;
      console.log(`Response: `);
      console.log(response);
      /////////////////////////////////
      if (response.statusText == 'OK') {
        /////////////////////////////////
        if (response.data.totalHits == 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }
        /////////////////////////////////
        if (currentPage == 1) {
          Notiflix.Notify.success(
            `Horray! We found ${response.data.totalHits} images!`
          );
        }
        /////////////////////////////////
        console.log(`Hits found: `);
        console.log(hits);
        for (let hit of hits) {
          displayResults(hit);
        }
        /////////////////////////////////
        const lightbox = new SimpleLightbox('.main-content>.image-result img');
        /////////////////////////////////
        pagesLeft = response.data.totalHits - 40 * currentPage;
        console.log(pagesLeft);
        if (pagesLeft <= 0) {
          loadMoreBtn.style.display = 'none';
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        } else {
          loadMoreBtn.style.display = 'block';
        }
      }
    });
}

function displayResults(image) {
  const resultNode = `<img
      src="${image.previewURL}"
      alt="${image.tags}"
      class="image-result__preview"
      href="${image.largeImageURL}"
    />
    <ul class="image-result__stats">
      <li class="image-result__stats__item">
        <p class="image-result__stats--title">Likes</p>
        <p class="image-result__stats--data">${image.likes}</p>
      </li>
      <li class="image-result__stats__item">
        <p class="image-result__stats--title">Views</p>
        <p class="image-result__stats--data">${image.views}</p>
      </li>
      <li class="image-result__stats__item">
        <p class="image-result__stats--title">Comments</p>
        <p class="image-result__stats--data">${image.comments}</p>
      </li>
      <li class="image-result__stats__item">
        <p class="image-result__stats--title">Downloads</p>
        <p class="image-result__stats--data">${image.downloads}</p>
      </li>
    </ul>`;
  let resultElement = document.createElement('article');
  resultElement.innerHTML = resultNode;
  resultElement.classList.add('image-result');
  imagesDisplay.appendChild(resultElement);
}
/////////////////////////////////
function loadMore() {
  currentPage++;
  fetchMain();
}
function newSearch() {
  currentPage = 1;
  fetchMain();
}
/////////////////////////////////
searchIcon.addEventListener('click', newSearch);
loadMoreBtn.addEventListener('click', loadMore);

loadMoreBtn.style.display = 'none';
