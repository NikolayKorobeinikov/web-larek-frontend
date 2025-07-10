# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
Приложение построено по архитектурному паттерну **MVP (Model-View-Presenter)**.  

- **Model** — бизнес-логика и данные;
- **View** — отображение и взаимодействие с DOM;
- **Presenter** — посредник, обрабатывающий события и управляющий обновлением модели и представления.

### Модели (Model)

    Класс                Назначение                           Методы и атрибуты                           
 `ProductModel`  Хранение списка товаров             `setProducts`, `getAll`, `getProductById`   
 `CartModel`     Управление корзиной                 `addToCart`, `removeFromCart`, `getItems`, `clearCart` 
 `OrderModel`    Работа с данными заказа             `setFormData`, `getFormData`, `submit`      

 ### Отображения (View)

    Класс                  Назначение                                          Методы                                   
 `ProductListView`  Отображает список товаров               `render(products)` 
 `CartView`         Отображает корзину                      `render(items)`, `remove(handler)`, `submit(handler)` 
 `OrderFormView`    Отображает и собирает данные формы      `render()`, `bindSubmit(handler)`, `getFormData()` 

 ###  Презентеры (Presenter)

    Класс                        Назначение                             Методы                                        
 `ProductPresenter`  Инициализация списка, обработка кликов  `init()`, `onProductSelect(id)`               
 `CartPresenter`     Добавление/удаление из корзины          `onAddToCart(id)`, `onRemove(id)`, `onSubmit()` 
 `AppPresenter`      Управление навигацией и инициализацией  `init()`, `switchView(view)`                  
