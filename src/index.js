import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

const API_KEY = '32683324-b0ce690598d4af74b245f496c';
const API_URL = 'https://pixabay.com/api/?key=';

const searchBar = document.querySelector('[name="search-bar-header"]');
const imagesDisplay = document.querySelector('.main-content');
const searchIcon = document.querySelector('.icon-search');
const loadMoreBtn = document.querySelector('.footer__load-more');
const modeSwitch = document.querySelector('.display-mode__input');

const cardCount = document.querySelector('#card-count');
const cardTotal = document.querySelector('#card-total');

const scrollTop = document.querySelector('.scroll-top');

let currentPage = 1;
let imagesLeft = 0;
let totalCards = 0;

let infinityScrollIsON = false;

async function fetchMain() {
  const searchedKey = searchBar.value;

  const response = await axios.get(
    `${API_URL}${API_KEY}&q=${searchedKey}&per_page=40&page=${currentPage}&image_type=photo&orientation=horizontal&safesearch=true`
  );

  const hits = response.data.hits;

  if (response.data.totalHits === 0) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      { position: 'left-bottom' }
    );
    return;
  }

  if (currentPage === 1) {
    Notiflix.Notify.success(
      `Horray! We found ${response.data.totalHits} images!`,
      { position: 'left-bottom' }
    );
  }

  for (const hit of hits) {
    displayResults(hit);
  }

  // eslint-disable-next-line no-unused-vars
  const lightbox = new SimpleLightbox('.main-content>.image-result img');

  imagesLeft = response.data.totalHits - 40 * currentPage;
  totalCards = response.data.totalHits;

  cardTotal.innerHTML = totalCards;
  cardCount.innerHTML = 40 * currentPage;

  if (imagesLeft <= 0) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results.",
      { position: 'left-bottom' }
    );
  } else {
    if (!infinityScrollIsON) loadMoreBtn.style.display = 'block';
  }
}

function displayResults(image) {
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
    </

ul>`;

  let resultElement = document.createElement('article');
  resultElement.innerHTML = resultNode;
  resultElement.classList.add('image-result');
  imagesDisplay.appendChild(resultElement);
}

function loadMore() {
  currentPage++;
  fetchMain();
  checkMode();
}

function newSearch() {
  imagesDisplay.innerHTML = ' ';
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

  if (totalCards === 0) return;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadMore();
  }
}

searchIcon.addEventListener('click', newSearch);
searchBar.addEventListener('change', newSearch);
loadMoreBtn.addEventListener('click', loadMore);
modeSwitch.addEventListener('change', modeSelection);
scrollTop.addEventListener('click', () => {
  window.scrollTo(0, 0);
});

loadMoreBtn.style.display = 'none';
modeSwitch.checked = false;
modeSelection();
