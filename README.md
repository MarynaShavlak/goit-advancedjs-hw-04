# goit-advancedjs-hw-04

ДЗ по темі «async/await і пагінація». Це продовження пошуку картинок з hw-03:
тепер картинки приходять по 15 штук, під галереєю є кнопка Load more, а коли
картинки закінчуються, з'являється повідомлення. Після кожного підвантаження
сторінка плавно прокручується вниз.

Жива сторінка: https://marynashavlak.github.io/goit-advancedjs-hw-04/

Запуск: `npm install`, потім `npm run dev`.

## Що додалось порівняно з hw-03

- всі запити переписала на async/await (`try...catch...finally` замість
  `then/catch`)
- `getImagesByQuery(query, page)` тепер приймає номер сторінки і просить
  `per_page: 15`
- кнопка Load more під галереєю, а лоадер переїхав під неї
- в `render-functions.js` додались `showLoadMoreButton()` і
  `hideLoadMoreButton()`
- повідомлення «We're sorry, but you've reached the end of search results.»
- прокрутка на дві висоти картки після кожного Load more

Файли ті самі: запит у `js/pixabay-api.js`, все про розмітку в
`js/render-functions.js`, логіка, повідомлення і прокрутка в `main.js`.

## Як працює пагінація

У `main.js` тримаю дві змінні: `query` і `page`.

- на сабміті запам'ятовую `query`, ставлю `page = 1`, чищу галерею і ховаю
  кнопку
- на Load more беру той самий `query` і запитую `page + 1`. Нову сторінку
  записую тільки якщо запит пройшов
- після кожної відповіді рахую, скільки всього сторінок. Якщо поточна вже
  остання, ховаю кнопку і показую повідомлення, інакше показую кнопку

```js
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
```

Прокрутка після Load more:

```js
const { height } = gallery.firstElementChild.getBoundingClientRect();
window.scrollBy({ top: height * 2, behavior: 'smooth' });
```

## Конспект: async/await

- `async` перед функцією означає, що вона завжди повертає проміс
- `await` чекає проміс і віддає його значення. По суті це той самий `then`,
  тільки записаний як звичайний рядок коду
- помилки ловлю через `try...catch`, а `finally` зручний для лоадера, бо спрацює
  в будь-якому разі
- `await` можна писати тільки всередині `async` функції (або на верхньому рівні
  модуля)

Те саме двома способами:

```js
// then / catch
getImagesByQuery(query, page)
  .then(data => createGallery(data.hits))
  .catch(error => showError(error))
  .finally(() => hideLoader());

// async / await
try {
  const data = await getImagesByQuery(query, page);
  createGallery(data.hits);
} catch (error) {
  showError(error);
} finally {
  hideLoader();
}
```

axios сам кидає помилку, якщо сервер відповів 4xx чи 5xx, тому в `catch`
потрапляє і відсутній інтернет, і неправильний ключ.

## Пагінація в Pixabay

- `page` це номер сторінки (починається з 1), `per_page` скільки картинок на
  сторінці (за замовчуванням 20, я ставлю 15)
- `totalHits` скільки картинок реально можна отримати через API. Для
  безкоштовного ключа це максимум 500, навіть якщо `total` більше
- якщо попросити сторінку далі цих 500, Pixabay відповідає помилкою 400
  (`"page" is out of valid range`), тому кнопку треба ховати вчасно

## Що було не очевидно

- Спочатку кінець колекції визначала по тому, що прийшло менше 15 картинок. Але
  якщо `totalHits` ділиться на 15 без остачі (наприклад, 30), остання сторінка
  теж приходить повна, кнопка лишалась, і наступний клік вже нічого не додавав.
  Через `totalHits` надійніше.
- Load more брав текст прямо з інпута. Якщо після пошуку дописати щось у поле і
  натиснути Load more, підвантажувались картинки вже по новому слову. Тепер
  запит зберігаю в змінну на сабміті.
- Номер сторінки збільшую тільки після успішного запиту, інакше після помилки
  одна сторінка просто пропускалась би.
- Поки йде запит, обидві кнопки вимкнені, щоб не наклацати кілька запитів
  одночасно.
- Прокрутку робить `main.js`, а не `createGallery`, так вимагає умова.
