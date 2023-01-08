import Notiflix, { Notify } from 'notiflix';
import axios from 'axios';

// API stuff
const API_KEY = '32683324-b0ce690598d4af74b245f496c';
const API_URL = 'https://pixabay.com/api/?key=';

// DOM elements
const searchBar = document.querySelector(`
[name="search-bar-header"]`);
const imagesDisplay = document.querySelector('.main-content');
const searchIcon = document.querySelector('.icon-search');
const pageContainer = document.querySelector('.pages');
//

async function fetchMain(page) {
  const searchedKey = searchBar.value;
  imagesDisplay.innerHTML = ' ';

  await axios
    .get(
      API_URL +
        API_KEY +
        `&q=${searchedKey}` +
        `&per_page=${20}` +
        `&page=${page}`
    )
    .then(response => {
      const numberOfPages = response.data.totalHits / 20;
      const hits = response.data.hits;
      console.log(`Response: `);
      console.log(response);

      if (response.statusText == 'OK') {
        if (response.data.totalHits == 0) {
          Notiflix.Notify.failure(
            'Sorry, we did not find any images. Please try other keywords'
          );
          return;
        }

        Notiflix.Notify.success(
          `Horray! We found ${response.data.totalHits} images!`
        );

        console.log(`Hits found: `);
        console.log(hits);
        for (let hit of hits) {
          displayResults(hit);
        }

        for (let i = 0; i <= numberOfPages; i++) {
          const pageNode = document.createElement('div');
          pageNode.classList.add('pages__item');
          pageNode.innerHTML = i + 1;
          pageContainer.appendChild(pageNode);
        }
        const pageButtons = document.querySelectorAll('.pages__item');
        for (btn of pageButtons) {
          console.log(btn);
          pageButtons.addEventListener(
            'click',
            fetchMain(event.currentTarget.value)
          );
        }
      }
    });
}

function displayResults(image) {
  const resultNode = `<img
      src="${image.previewURL}"
      alt=""
      class="image-result__preview"
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

searchIcon.addEventListener('click', fetchMain(1));

// for (let i = 0; i < 100; i++) displayResults();
// Notiflix.Notify.info('Hooray! We was able to find 100 images !');
