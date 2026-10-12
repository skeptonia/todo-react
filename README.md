# To Do List — учебный проект на React

Список задач с добавлением, удалением, отметкой выполнения, поиском, отдельной страницей задачи и анимациями появления/удаления. Бэкенд — `json-server`, состояние — React Context + кастомные хуки, роутер свой, стили — глобальные токены + CSS-модули на SCSS.

## Стек

| Слой | Решение |
|---|---|
| UI | React 19 |
| Сборка | Vite 7 + `@vitejs/plugin-react` |
| Стили | SCSS в CSS-модулях + глобальная база токенов в `src/styles/` |
| Роутер | самописный (`src/Router.jsx`), без react-router |
| Состояние | React Context (`src/context/TasksContext.jsx`) + хуки из `src/hooks/` |
| Данные | `json-server` (`db.json5`), запросы в `src/API/tasksAPI.js` |
| Линт | ESLint 9 + `eslint-plugin-react-hooks` |

## Запуск

```bash
npm install
npm run server   # json-server, http://localhost:3001, файл db.json5 с --watch
npm run dev      # Vite, http://localhost:5173
```

`npm run server` должен быть запущен параллельно: без него `fetch` в `tasksAPI` не доходит до сервера и список остаётся пустым.

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | dev-сервер Vite с HMR |
| `npm run server` | json-server с автоперезаписью `db.json5` |
| `npm run build` | продакшен-сборка в `dist/` |
| `npm run preview` | локальный просмотр собранного `dist/` |
| `npm run lint` | ESLint по всему проекту |

## Структура

```
src/
├── main.jsx                          точка входа
├── App.jsx                           TasksProvider + Router
├── Router.jsx                        matchPath, useRoute, Router
├── API/tasksAPI.js                   CRUD над json-server
├── context/TasksContext.jsx          состояние приложения
├── hooks/
│   ├── useTasks.js                   задачи, поиск, CRUD, анимации
│   ├── useIncompleteTaskScroll.js    ref на первую невыполненную задачу
│   └── useTasksLocalStorage.js       чтение/запись в localStorage
├── pages/                            TasksPage, TaskPage
├── components/
│   ├── AddTaskForm, SearchTaskForm, TodoInfo, TodoList
│   └── TodoItem, Field, Button, RouterLink
└── styles/                           normalize, fonts, variables, utils, globals
```

## Что реализовано

- добавление задачи: `POST` на сервер, очистка поля и поиска, возврат фокуса в инпут;
- удаление задачи **с анимацией**: строка растворяется и уезжает вверх, соседние строки сдвигаются на освободившееся место, фазы разведены через `transition-delay`;
- появление задачи **с анимацией** — `@keyframes appear` на `.isAppearing`;
- отметка выполнения через `PATCH`: обновляется только одна задача, весь список не перезапрашивается;
- поиск по подстроке с отдельным состоянием «ничего не найдено»;
- страница задачи `/tasks/:id` с состояниями загрузки и ошибки;
- кнопка «прокрутить к первой невыполненной задаче» (`scrollIntoView` по ref);
- 404-страница для неизвестного адреса.

## Как устроены анимации

В `useTasks` живут два идентификатора — `disappearingTaskId` и `appearingTaskId`, а не булевы флаги: `TodoItem` сравнивает их со своим `id` и добавляет себе класс `isDisappearing` или `isAppearing`. Всё движение описано в `TodoItem.module.scss` через `var(--transition-duration)`, а расстояние между строками берётся из `--todoListRowGap`, объявленной в `Todo.module.scss`.

Ключевая идея: задача **не удаляется из массива сразу**. Сначала элемент получает класс (живёт, но невидим), и только через 400 мс — ровно столько, сколько длится анимация — он уходит из состояния, то есть из DOM. Для появления всё наоборот: `setTasks` и `setAppearingTaskId` батчатся React'ом в один рендер, поэтому новый элемент рождается уже с классом анимации.

Разбор с таймингами и граблями — в `code moments.md`, хронология по датам — в `project history.md`.

## Документы проекта

- `project history.md` — что менялось по датам и почему.
- `code moments.md` — разборы по темам: хуки, Context, async-CRD, роутер, стили, анимации.

## Известные проблемы

- `deleteTask` внутри `setTimeout` фильтрует `tasks` из замыкания, а не актуальный стейт: если за 400 мс успеть переключить чекбокс или добавить задачу, это изменение откатится. Нужен `setTasks((prev) => prev.filter(...))`.
- На анимацию выделен один id, поэтому два удаления подряд (или добавление во время удаления) прерывают анимацию первой задачи.
- Таймеры не гасятся через `clearTimeout`.
- `src/hooks/useCombinedRefs.js` не импортируется нигде, а имя файла не совпадает с именем функции (`useCombineRefs`).
- `useTasks.js:15-16` — мёртвый код: `firstIncompleteTaskRef` и `firstIncompleteTaskId` провайдер берёт из `useIncompleteTaskScroll`.
- `npm run lint` даёт 5 ошибок и 1 предупреждение (2 из них — неиспользуемые `useRef` в `TodoItem.jsx` и `memo` в `TodoList.jsx`).
