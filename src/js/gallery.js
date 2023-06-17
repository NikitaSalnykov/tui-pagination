import { UnsplashAPI } from "./UnsplashAPI"
import createGalleryCard from "../templates/gallery-card.hbs"
import Pagination from 'tui-pagination'
import 'tui-pagination/dist/tui-pagination.css';
import onCheckboxClick from "./isChangeTheme";

import refs from "./refs"

refs.checkBox.addEventListener('change', onCheckboxClick)
refs.form.addEventListener('submit', onSearchFormSubmit);

const unsplashApi = new UnsplashAPI(12)

const options = { 
     totalItems: 12,
     itemsPerPage: unsplashApi.per_page,
     visiblePages: 5,
     page: 1,
     }

const pagination = new Pagination(refs.container, options)

const page = pagination.getCurrentPage();

async function onRenderPage(page) {
  try {
    const resp = await unsplashApi.getPopularPhotos(page);
    refs.gallary.innerHTML = createGalleryCard(resp.data.results);
    pagination.reset(resp.data.total);

    pagination.on('afterMove', createPopularPagination)
    refs.container.classList.remove('is-hidden')
  } catch (err) {
    console.log(err);
  }
}

async function createPopularPagination (event) {
  const currentPage = event.page;
    try {
    const resp = await unsplashApi.getPopularPhotos(currentPage);
    refs.gallary.innerHTML = createGalleryCard(resp.data.results);
  } catch (err) {
    console.log(err);
  }
} 

onRenderPage(page);

async function onSearchFormSubmit(event) {
  event.preventDefault(); 
  const searchQuery = event.currentTarget.elements['user-search-query'].value.trim();
  refs.container.classList.add('is-hidden')
  
  unsplashApi.query = searchQuery
  if (!searchQuery) {
    return alert('empty')
  }

  try {
    const resp = await unsplashApi.getPhotoByQuery(page);
    
    if (resp.data.results.length === 0) {
      console.log('sdasf');
      refs.gallary.innerHTML = '';
      refs.container.classList.add('is-hidden')
      return;
    }

      if (resp.data.results.length < unsplashApi.per_page) {
        refs.container.classList.add('is-hidden')
        refs.gallary.innerHTML = createGalleryCard(resp.data.results);
        return
    }

    refs.gallary.innerHTML = createGalleryCard(resp.data.results);
    pagination.reset(resp.data.total);

     pagination.off('afterMove', createPopularPagination);
     pagination.on('afterMove', createSearchPagination);

     refs.container.classList.remove('is-hidden')
   } catch (err) {
    console.log(err);
  }
}

async function createSearchPagination(event) {
  const currentPage = event.page;
    try {
    const resp = await unsplashApi.getPhotoByQuery(currentPage);
    refs.gallary.innerHTML = createGalleryCard(resp.data.results);
  } catch (err) {
    console.log(err);
  }
}

/**
  |============================
  | Імпортуй свою API і напиши фу-цію "onRenderPage()", яка буде робити запит на сервер і вона ж відрендерить розмітку. Пробуй використовувати модульний підхід
  | можешь окремо строрити файл з розміткою і потім його імпортувати для використання. Також можешь використати шаблонізатор. Ментор тобі в цьому допоможе ; )
  | 
  | Після того коли ми успішно виконали рендер данних з бекенду, передай наступному учаснику виконання наступного функціоналу. Нам потрібно перейти на сайт бібліотеки
  | і підключити пагінацію - https://www.npmjs.com/package/tui-pagination - Бібліотека "tui-pagination".
  |
  | Після успішного підключення пагінації передай виконання на наступного учасника. Далі нам потрібно створити новий запит за картинками по ключовому слову. Переходь
  | в UnsplashAPI.
  |
  | Ось і готовий наш другий запит, давай його випробуємо! У нас з вами тут є тег "form", давайте його використаєм, знайдемо його у Дом дереві і повісимо слуха події
  | ви знаєте яка подія повинна бути) Ну і наостанок напишемо callBack для неї "onSearchFormSubmit()", там де зробимо головну логіку. Після рендера далі дорозберемось 
  | з нашою пагінація, цікаво як вона себе буде поводитись після зміни запиту?
  |
  | Якщо у нас залишився час, давате підключимо перемикач теми. Він знаходиться у файлі "isChangeTheme.js".
  |============================
*/
