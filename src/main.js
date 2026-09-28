import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

iziToast.settings({
  position: 'topRight',
  timeout: 5000,
});

const form = document.querySelector('.form');
const searchButton = form.querySelector('button[type="submit"]');
const loadMoreButton = document.querySelector('.load-more-btn');
const gallery = document.querySelector('.gallery');

let query = '';
let page = 1;

form.addEventListener('submit', handleSubmit);
loadMoreButton.addEventListener('click', handleLoadMore);

async function handleSubmit(event) {
  event.preventDefault();

  const searchQuery = form.elements['search-text'].value.trim();

  if (!searchQuery) {
    iziToast.warning({ message: 'Please enter a search query.' });
    return;
  }

  query = searchQuery;
  page = 1;

  clearGallery();
  hideLoadMoreButton();
  setLoading(true);

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    createGallery(data.hits);
    updateLoadMoreButton(data.totalHits);
  } catch (error) {
    showRequestError(error);
  } finally {
    setLoading(false);
  }
}

async function handleLoadMore() {
  const nextPage = page + 1;

  setLoading(true);

  try {
    const data = await getImagesByQuery(query, nextPage);

    page = nextPage;
    createGallery(data.hits);
    scrollByTwoCards();
    updateLoadMoreButton(data.totalHits);
  } catch (error) {
    showRequestError(error);
  } finally {
    setLoading(false);
  }
}

function updateLoadMoreButton(totalHits) {
  const totalPages = Math.ceil(totalHits / PER_PAGE);

  if (page >= totalPages) {
    hideLoadMoreButton();
    iziToast.info({
      message: "We're sorry, but you've reached the end of search results.",
    });
    return;
  }

  showLoadMoreButton();
}

function scrollByTwoCards() {
  const card = gallery.firstElementChild;

  if (!card) {
    return;
  }

  const { height } = card.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}

function setLoading(isLoading) {
  searchButton.disabled = isLoading;
  loadMoreButton.disabled = isLoading;

  if (isLoading) {
    showLoader();
  } else {
    hideLoader();
  }
}

function showRequestError(error) {
  iziToast.error({
    message: `Something went wrong: ${error.message}`,
  });
}
