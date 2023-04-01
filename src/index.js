import './sass/index.scss';//import sass
import NewsApiService from './js/api-service';//import class NewsApiService from file api-service.js //support for API requests to Pixabay
import { lightbox } from './js/lightbox';//import lightbox from file/js/lightbox.js//function is responsible for displaying enlarged images
import { Notify } from 'notiflix/build/notiflix-notify-aio';//import Notify class from library Notiflix to display notifications


//settings for API Pixabay
const settings = {
  apiUrl: 'https://pixabay.com/api/',
  apiKey: '34597328-b6c32e0b24abc6857736d8e3a',
  perPage: 40,
  safeSearch: true,
  imageType: 'photo',
  orientation: ['horizontal','vertical']
};
//
export default settings;

//references to elements, for referring to those elements in the code.
const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

//defined variable isShown to track the number of images displayed
let isShown = 0;
const newsApiService = new NewsApiService();
refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);


//defined function onSearch, 
function onSearch(e) {
  e.preventDefault();

  refs.galleryContainer.innerHTML = '';
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  newsApiService.resetPage();

  if (newsApiService.query === '') {
    Notify.warning('Please, fill the main field');
    //added the is-hidden class to the load-more reference, button load-more is-hidden if input is empty && was deleted
    refs.loadMoreBtn.classList.add('is-hidden');
    return;
  }

  isShown = 0;
  fetchGallery();
  onRenderGallery(hits);
  
}

//function called after loadmore click. load next img from API Pixabay
async function onLoadMore() {
  newsApiService.incrementPage();
  fetchGallery();
  
}
//function sends a request to API Pixabay and rendering gallery
async function fetchGallery() {
  refs.loadMoreBtn.classList.add('is-hidden');

  const r = await newsApiService.fetchGallery();
  const { hits, total } = r;
  isShown += hits.length;

  if (!hits.length) {
    Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    refs.loadMoreBtn.classList.add('is-hidden');
    return;
  }

  onRenderGallery(hits);
  isShown += hits.length;

  if (isShown < total) {
    Notify.success(`Hooray! We found ${total} images !!!`);
    refs.loadMoreBtn.classList.remove('is-hidden');  
    
  }

  if (isShown >= total) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  
}
//rendering photos usings templates HTML i Json from API  Pixabay
function onRenderGallery(elements) {

  const galleryContainer = document.querySelector('.gallery');
  
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a href="${largeImageURL}">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </div>`;
      }
    )
    .join('');
  
  galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh(); 
  
  
  }

