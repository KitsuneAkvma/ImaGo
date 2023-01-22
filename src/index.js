import Notiflix, { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import * as lodash from 'lodash';

// API stuff
const API_KEY = '32683324-b0ce690598d4af74b245f496c';
const API_URL = 'https://pixabay.com/api/?key=';

// DOM elements
const searchBar = document.querySelector(`
[name="search-bar-header"]`);
const imagesDisplay = document.querySelector('.main-content');
const searchIcon = document.querySelector('.icon-search');
const loadMoreBtn = document.querySelector('.footer__load-more');
const modeSwitch = document.querySelector('.display-mode__input');

const cardActions = document.querySelector('.card-actions');
const cardCount = document.querySelector('#card-count');
const cardTotal = document.querySelector('#card-total');

const scrollTop = document.querySelector('.scroll-top');
// Global Variables
let currentPage = 1;
let imagesLeft = 0;
let totalCards = 0;

let infinityScrollIsON = false;
////////////////////////////

async function fetchMain() {
  // Get input's value
  const searchedKey = searchBar.value;
  // Clear website

  // Search for images by keyword. Show 40 images per page and show specified page ( logic done bellow)
  await axios
    .get(
      `${API_URL}${API_KEY}&q=${searchedKey}&per_page=40&page=${currentPage}&image_type=photo&orientation=horizontal&safesearch=true`
    )
    .then(response => {
      // Save array of images objecs as variable
      const hits = response.data.hits;

      // If promise is fuffiled but notthing has been found
      if (response.data.totalHits == 0) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          { position: 'left-bottom' }
        );
        return;
      }
      // Otherwise, show succes notify (only if user is on first page)
      if (currentPage == 1) {
        Notiflix.Notify.success(
          `Horray! We found ${response.data.totalHits} images!`,
          { position: 'left-bottom' }
        );
      }
      // Call Rendering function for every image object found
      for (let hit of hits) {
        displayResults(hit);
      }
      // Create SimpleLightbox Gallery
      const lightbox = new SimpleLightbox('.main-content>.image-result img');

      // Create Pagination Logic
      imagesLeft = response.data.totalHits - 40 * currentPage;

      totalCards = response.data.totalHits;
      cardTotal.innerHTML = totalCards;
      cardCount.innerHTML = 40 * currentPage;
      // If There is no images left - hide "Load More..." button and show notify
      if (imagesLeft <= 0) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results.",
          { position: 'left-bottom' }
        );
      } else {
        // Otherwise show "Load More..." button
        if (!infinityScrollIsON) loadMoreBtn.style.display = 'block';
      }
    });
}

function displayResults(image) {
  // HTML structure of result
  // used loading='Lazy' and used large image as previev to achive better UX
  const resultNode = `<img
      src="${image.webformatURL}"
      alt="${image.tags}"
      class="image-result__preview"
      href="${image.largeImageURL}"
      loading="lazy"
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
  // Adding results to DOM
  let resultElement = document.createElement('article');
  resultElement.innerHTML = resultNode;
  resultElement.classList.add('image-result');
  imagesDisplay.appendChild(resultElement);
}
/////////////////////////////////
function loadMore() {
  // Increment current page counter AND THEN call fetch function
  currentPage++;
  fetchMain();
  checkMode();
}
function newSearch() {
  imagesDisplay.innerHTML = ' ';
  // Reset current page counter AND THEN call fetch function
  currentPage = 1;
  fetchMain();
  checkMode();
}
function modeSelection() {
  if (modeSwitch.checked === true) {
    infinityScrollIsON = true;

    window.addEventListener('scroll', infinityScroll);
    Notiflix.Notify.info('Infinite scroll is ON', { position: 'left-bottom' });
  } else {
    infinityScrollIsON = false;

    window.removeEventListener('scroll', infinityScroll);
    Notiflix.Notify.info('Infinite scroll is OFF', { position: 'left-bottom' });
  }
  checkMode();
}
function checkMode() {
  if (infinityScrollIsON) {
    loadMoreBtn.style.display = 'none';
    document.querySelector('.load-more').style.color = '#094067';
    document.querySelector('.infinite-scroll').style.color = '#ef4565';
  } else {
    if (totalCards !== 0) loadMoreBtn.style.display = 'block';
    document.querySelector('.load-more').style.color = '#ef4565';
    document.querySelector('.infinite-scroll').style.color = '#094067';
  }
}
function infinityScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (totalCards == 0) return;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadMore();
  }
}

// Event Listeners (done indirectly because of need to modify some values before callbacks)
searchIcon.addEventListener('click', newSearch);
searchBar.addEventListener('change', newSearch);
loadMoreBtn.addEventListener('click', loadMore);
modeSwitch.addEventListener('change', modeSelection);
scrollTop.addEventListener('click', () => {
  window.scrollTo(0, 0);
});

//-------DEFAULTS-------//

// Hide "Load More..." button on default
loadMoreBtn.style.display = 'none';
modeSwitch.checked = false;
modeSelection();
