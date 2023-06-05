import newPostModule from "../newPost.js";
import registrationModule from "../reg.js";
import profileModule from "../profile.js";
import coursesModule from "../courses.js";
export default async function Controller(routeName) {
  let wrapper = document.querySelector(".wrapper");
  const cssFiles = ["main", `login`, `newPost`, "profile", `courses`];
  switch (routeName) {
    case "login":
      removeAllChildren(wrapper);
      login(wrapper);
      registrationModule();
      differentCss(`login`, cssFiles);
      break;
    case "registration":
      removeAllChildren(wrapper);
      registration(wrapper);
      registrationModule();
      differentCss(`login`, cssFiles);
      break;
    case "favorite":
      removeAllChildren(wrapper);
      differentCss(`main`, cssFiles);
      window.scrollBy(0, 0);
      let getPosts = JSON.parse(localStorage.getItem("favoriteData"));
      const heartCounter = document.querySelector(`.profile__counter`);
      const newTitle = document.createElement(`h2`);
      if (getPosts && getPosts.length > 0) {
        const newTitle = document.createElement(`h2`);
        newTitle.classList.add("favorite-title");
        newTitle.innerHTML = "Избранное";
        getPosts.forEach((post, idx) => {
          renderFavorite(wrapper, post, idx);
          wrapper.prepend(newTitle);
        });
        heartCounter.innerHTML = getPosts.length;
        wrapper.addEventListener("click", ({ target }) => {
          const closeBtn = target.closest("box-icon");
          if (closeBtn) {
            const postEl = target.closest(".post");
            deleteFavouritePost(postEl, getPosts, heartCounter);
          }
        });
      } else {
        localStorage.removeItem(`favoriteData`);
        removeAllChildren(wrapper);
        newTitle.classList.add(`favorite-title`);
        newTitle.innerHTML = `Вы еще ничего не добавили в избранное`;
        wrapper.append(newTitle);
      }
      break;
    case "new":
      removeAllChildren(wrapper);
      newPost(wrapper);
      newPostModule();
      differentCss(`newPost`, cssFiles);
      break;
    case "profile":
      removeAllChildren(wrapper);
      renderProfile(wrapper);
      profileModule();
      differentCss(`profile`, cssFiles);
      break;
    case "courses":
      removeAllChildren(wrapper);
      renderCourses(wrapper);
      coursesModule();
      differentCss("courses", cssFiles);
      break;
    default:
      removeAllChildren(wrapper);
      differentCss(`main`, cssFiles);
      window.scrollBy(0, 0);
      async function getPost() {
        const response = await fetch(`https://api.tvmaze.com/shows`, {
          method: "GET",
        });
        const dataPost = await response.json();
        const result = dataPost.filter((el, i) => i < 20);
        renderPost(result, wrapper);
      }
      await getPost();
      basket();
  }
}

function removeAllChildren(dataContainer) {
  dataContainer.querySelectorAll("*").forEach((node) => node.remove());
}
function renderFavorite(dataContainer, post, postIndex) {
  let newFavoritePost = document.createElement("div");
  newFavoritePost.classList.add("post");
  newFavoritePost.dataset.id = postIndex;
  newFavoritePost.innerHTML = `
        <box-icon name='x' size="lg"></box-icon>
        <div class="post__profile">
            ${post.author}
        </div>
        <a class="post__title" href="#">
            ${post.title}
        </a>
        <img class="post__image" src="${post.imgSrc}" alt="">
        <p class="post__text text">${post.description}</p>
        
        <a class="post__btn btn" href="#">
            Читать далее
        </a>
    `;
  dataContainer.prepend(newFavoritePost);
}
function deleteFavouritePost(post, favouritesPosts, heart) {
    favouritesPosts.splice(post.dataset.id, 1);
    localStorage.setItem("favoriteData", JSON.stringify(favouritesPosts));
    heart.innerHTML = favouritesPosts.length;
    post.remove();
}
function renderPost(posts, wrapper) {
  removeAllChildren(wrapper);
  posts.forEach((el) => {
    const newPost = document.createElement(`div`);
    newPost.classList.add(`post`);
    newPost.innerHTML = `
        <div class="post__profile">
            ${el.id}
        </div>
        <a class="post__title" href="#">
            ${el.name}
        </a>
        <img class="post__image" src="${el.image.original}" alt="images loadings">
        <p class="post__text text">${el.summary.replace(
          /<\/?p>|<\/?b>/g,
          ""
        )}</p>
        <a class="post__btn btn" href="#">
            Читать далее
        </a> 
        <box-icon name='heart' type='solid'></box-icon>
        `;
    wrapper.prepend(newPost);
  });
}
function basket() {
  const posts = document.getElementsByClassName(`post`);
  const heartCounter = document.querySelector(`.profile__counter`);
  if (posts.length > 0) {
    for (let i = 0; i < posts.length; i++) {
      posts[i].setAttribute(`data-id`, `${i}`);
      posts[i] 
        .querySelector(`box-icon[name='heart']`)
        .setAttribute("data-cart", "");
    }
    window.addEventListener(`click`, (e) => {
      if (e.target.hasAttribute("data-cart")) {
        e.preventDefault();
        const post = event.target.closest(`.post`);
        let heart = post.querySelector(`box-icon[name='heart']`);
        let favoriteData = [];
        localStorage.getItem(`favoriteData`)
          ? (favoriteData = JSON.parse(localStorage.getItem(`favoriteData`)))
          : "";
        const updateLocal = () => {
          localStorage.setItem("favoriteData", JSON.stringify(favoriteData));
        };
        let dataPost = {
          id: post.dataset.id,
          author: post.querySelector(`.post__profile`).innerText,
          imgSrc: post.querySelector(`.post__image`).src,
          description: post.querySelector(`.post__text`).innerHTML,
          title: post.querySelector(`.post__title`).innerText,
        };
        favoriteData.push(dataPost);
        heart.classList.add(`active`);
        heartCounter.innerHTML = favoriteData.length;
        updateLocal();
      }
    });
  }

  const favoriteData = JSON.parse(localStorage.getItem(`favoriteData`));
  if (favoriteData && favoriteData.length > 0) {
    heartCounter.innerHTML = favoriteData.length;
    Array.from(posts).forEach((item) => {
      const isData = favoriteData.find((obj) => obj.id === item.dataset.id);
      if (isData) {
        const heart = item.querySelector(`box-icon`);
        heart.classList.add(`active`);
      }
    });
  }
}
function login(wrapper) {
  const form = document.createElement(`form`);
  form.className = "registration";
  form.innerHTML = `
    <h3 class="registration__title">
        Вход
    </h3>
    <div class="registration__box">
        <label  class="registration__clue" for="email">
            E-mail
        </label>
        <input placeholder="email@gmail.com" class="registration__inp" required type="email" id="email">
    </div>
    <div class="registration__box">
    <label class="registration__clue" for="password">
        Пароль
    </label>
    <input placeholder="123456" class="registration__inp" required type="password" id="password">
    <i class="fa-solid fa-eye-slash"></i>
    </div>
    <button class="registration__btn" type="submit">
        Войти
    </button>
    <div class="if-login">
        Ещё нет аккаунта?
        <a href="#registration">Зарегистрируйтесь</a>
    </div>
    `;
  wrapper.appendChild(form);
}
function registration(wrapper) {
  const form = document.createElement(`form`);
  form.setAttribute(`class`, `registration`);
  form.innerHTML = `
    <h3 class="registration__title">
        Регистрация
    </h3>

    <div class="registration__box">
        <label class="registration__clue" for="email">
            E-mail
        </label>
        <input class="registration__inp" required type="email" id="email">
    </div>
    <div class="registration__box">
        <label class="registration__clue" for="nikname">
            Никнейм
        </label>
        <input class="registration__inp" required type="text" id="nikname">
    </div>
    <div class="registration__box">
        <label class="registration__clue" for="password">
            Пароль
        </label>
        <input class="registration__inp" required oncopy='event.preventDefault()' type="password" id="password">
        <i class="fa-solid fa-eye-slash"></i>
    </div>
    <div class="registration__box">
    <label class="registration__clue" for="confirm-password">
        Пароль ещё раз
    </label>
    <input class="registration__inp" required type="password" id="confirm-password">
    <i class="fa-solid fa-eye-slash"></i>
    </div>

    <button class="registration__btn" type="submit">
        Зарегистрироваться
    </button>
    <div class="if-login">
        Уже зарегистрированы?
        <a href="#login">Войдите</a>
    </div>
    `;
  wrapper.append(form);
}
function newPost(wrapper) {
  const formNewPost = document.createElement(`form`);
  formNewPost.setAttribute(`class`, `new-post`);
  formNewPost.innerHTML = `
    <input class="new-post__title" type="text" placeholder="Заголовок" required>
    <textarea class="new-post__text" id="text" placeholder="Текст публикации" required></textarea>
    <hr>
    <button class="new-post__next-setting" disabled>
        Далее к настройкам
    </button>`;
  const formSetting = document.createElement(`form`);
  formSetting.setAttribute(`class`, `setting`);
  formSetting.innerHTML = `
    <h3 class="setting__title title">Настройки публикации</h3>
    <hr>

    <div class="setting__publication">
        <p class="setting__publication-text min-title">
            <span>*</span> Тип публикации
        </p>
        <div class="type-publication">
            <input type="radio" id="post" name="type-publication" value="post" checked required>
            <label class="checked-label" for="post">Пост</label>

            <input type="radio" id="dewey" name="type-publication" value="dewey" required>
            <label class="checked-label" for="dewey">Новость</label>

            <input type="radio" id="louie" name="type-publication" value="louie" required>
            <label class="checked-label" for="louie">Статьи</label>
        </div>
    </div>

    <p class="min-title">
        <span>*</span> Теги
    </p>
    <div class="select-container tags"></div>
    <p class="min-title">
        <span>*</span> Категория
    </p>
    <div class="select-container category"></div>
    <div class="difficulty">
        <p class="min-title">
            Уровень сложности
        </p>

        <input type="radio" id="no-difficulty" name="difficulty" required>
        <label for="no-difficulty">
            Не указан
        </label>
        <input type="radio" id="elementary" name="difficulty" required>
        <label for="elementary">
            Простой
        </label>
        <input type="radio" id="medium" name="difficulty" required>
        <label for="medium">
            Средний
        </label>
        <input type="radio" id="hard" name="difficulty" required>
        <label for="hard">
            Сложный
        </label>
    </div>

    <textarea class="setting__min-text" id="text" placeholder="Текст публикации (Краткое содержание)" required></textarea>

    <p class="setting__prompt">
        Рекомендуем от 100 до 2000 символов, максимально допустимое количество - 3000 символов. В ленте
        можно размещать только текст и ссылки.
    </p>

    <p class="min-title">
        <span>
            *
        </span>
        Текст кнопки «Читать далее»
    </p>
    <input class="input" type="text" placeholder="Читать далее" require>    
    <hr>

    <button class="btn to-moderate">
        Отправить на модерацию
    </button>`;
  wrapper.appendChild(formNewPost);
  wrapper.appendChild(formSetting);
}
function renderCourses(wrapper) {
  const material = {
    
  };

  wrapper.innerHTML = `
    <div class="info-block">
    <h2>Подготовка окружения</h2>
    <p>Для того, чтобы писать код нам нужно будет установить IDE(Integrated Development Environment) -
        Интегрированная среда разработки, другими словами это специальная программа, которая упрощает
        процесс написания кода (выделяет разными цветами, форматирует, автозамены и т.д)</p><br>

    <p>На самом деле писать код можно и в обычном Блокноте, который идет в пакете Windows, но я уверена, вы
        почувствуете разницу и выберете специальные IDE программы.</p><br>

    <p>Есть множество вариантов IDE программ:</p><br>

    <ul>
        <li>Visual Studio Code</li>
        <li>Sublime Text</li>
        <li>Inteliji IDEA</li>
        <li>Atom и т.д</li>
    </ul><br>

    <p>Во время обучения я рекомендую использовать Visual Studio Code, так как у него удобный и
        функциональный интерфейс и он прост в использовании.

        <br>
        Как правильно установить и запустить программу Visual Studio Code вы узнаете на уроке.
    </p>
</div>

<aside class="sidebar">
    <div class="accordion">
        <div class="accordion__header">
            <div class=accordion__glave>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M20 5h-8.586L9.707 3.293A.997.997 0 0 0 9 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2zM4 19V7h16l.002 12H4z"></path></svg>
                <p class=accordion__glave-text>Глава 1</p>
            </div>
            <div class=accordion__name-courses>
                <p class=accordion__text text>JS</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg> 
            </div>
        </div>
        <div class="accordion__body">
            <div class='btn-courses active'>
                <div class=btn-courses__material>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V7h14V6l.002 14H5z"></path><path d="M7 9h10v2H7zm0 4h5v2H7z"></path></svg>
                    <p class=btn-courses__material-title>
                        Материал 1
                    </p>
                </div>
                <p class=btn-courses__info-text>
                    Что такое JavaScript?
                </p>
            </div>
            <div class='btn-courses'>
                <div class=btn-courses__material>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V7h14V6l.002 14H5z"></path><path d="M7 9h10v2H7zm0 4h5v2H7z"></path></svg>
                    <p class=btn-courses__material-title>
                        Материал 1
                    </p>
                </div>
                <p class=btn-courses__info-text>
                    Что такое JavaScript?
                </p>
            </div>
            <div class='btn-courses'>
                <div class=btn-courses__material>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V7h14V6l.002 14H5z"></path><path d="M7 9h10v2H7zm0 4h5v2H7z"></path></svg>
                    <p class=btn-courses__material-title>
                        Материал 1
                    </p>
                </div>
                <p class=btn-courses__info-text>
                    Что такое JavaScript?
                </p>
            </div>
            <div class='btn-courses'>
                <div class=btn-courses__material>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V7h14V6l.002 14H5z"></path><path d="M7 9h10v2H7zm0 4h5v2H7z"></path></svg>
                    <p class=btn-courses__material-title>
                        Материал 1
                    </p>
                </div>
                <p class=btn-courses__info-text>
                    Что такое JavaScript?
                </p>
            </div>
            <div class='btn-courses'>
                <div class=btn-courses__material>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V7h14V6l.002 14H5z"></path><path d="M7 9h10v2H7zm0 4h5v2H7z"></path></svg>
                    <p class=btn-courses__material-title>
                        Материал 1
                    </p>
                </div>
                <p class=btn-courses__info-text>
                    Что такое JavaScript?
                </p>
            </div>
            <div class='btn-courses'>
                <div class=btn-courses__material>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V7h14V6l.002 14H5z"></path><path d="M7 9h10v2H7zm0 4h5v2H7z"></path></svg>
                    <p class=btn-courses__material-title>
                        Материал 1
                    </p>
                </div>
                <p class=btn-courses__info-text>
                    Что такое JavaScript?
                </p>
            </div>
            <div class='btn-courses'>
                <div class=btn-courses__material>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V7h14V6l.002 14H5z"></path><path d="M7 9h10v2H7zm0 4h5v2H7z"></path></svg>
                    <p class=btn-courses__material-title>
                        Материал 1
                    </p>
                </div>
                <p class=btn-courses__info-text>
                    Что такое JavaScript?
                </p>
            </div>
            <div class='btn-courses'>
                <div class=btn-courses__material>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V7h14V6l.002 14H5z"></path><path d="M7 9h10v2H7zm0 4h5v2H7z"></path></svg>
                    <p class=btn-courses__material-title>
                        Материал 1
                    </p>
                </div>
                <p class=btn-courses__info-text>
                    Что такое JavaScript?
                </p>
            </div>
            <div class='btn-courses'>
                <div class=btn-courses__material>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V7h14V6l.002 14H5z"></path><path d="M7 9h10v2H7zm0 4h5v2H7z"></path></svg>
                    <p class=btn-courses__material-title>
                        Материал 1
                    </p>
                </div>
                <p class=btn-courses__info-text>
                    Что такое JavaScript?
                </p>
            </div>
            <div class='btn-courses'>
                <div class=btn-courses__material>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V7h14V6l.002 14H5z"></path><path d="M7 9h10v2H7zm0 4h5v2H7z"></path></svg>
                    <p class=btn-courses__material-title>
                        Материал 1
                    </p>
                </div>
                <p class=btn-courses__info-text>
                    Что такое JavaScript?
                </p>
            </div>
        </div>
    </div>

</aside>
`;
}
function renderProfile(wrapper) {
  const userData = {
    name: "Василий",
    surname: "Понторезов",
    email: "vasil5632@gmail.com",
    role: "MENTOR",
    password: "********",
    courses: "Java development",
  };
  const roleMappings = {
    MENTOR: "Учитель",
    STUDENT: "Студент",
    ADMIN: "Администратор",
  };
  if (userData.role && roleMappings[userData.role]) {
    userData.role = roleMappings[userData.role];
  }

  wrapper.innerHTML = `
    <h3 class="title-profile">
        Ваш профиль
    </h3>
    <aside class="sidebar">

        <img 
        class="sidebar__avatar"
        src="data:image/jpeg;base64,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"
        alt="Аватарка пользователя">
        <input class="sidebar__file-hidden" style="display: none" type='file' id="user-image">
        <label class="sidebar__change-file" style="cursor: pointer; margin: 4px"  for="user-image">
            Выберите картинку профиля
        </label>
        <h2 class="sidebar__name">
            ${userData.name}
            ${userData.surname}
        </h2>
        <label class="sidebar__about-title" for="sayAboutYou">
        Расскажите о себе
        </label>
        <p class="sidebar__about-me">
            No bit yet
        </p>
    </aside>
    <div class="about-user">
        <h3 class="about-user__title title" >
            E-mail адрес:
        </h3>
        <h4 class="about-user__data-txt">
             ${userData.email}

        </h4>

        <h3 class="about-user__title title" >
            Роль:
        </h3>
        <h4 class="about-user__data-txt">
           ${userData.role}
        </h4>
        <h3 class="about-user__title title" >
            Курс:
        </h3>
        <a class="about-user__data-txt" href="#courses">
           ${userData.courses}
        </a>

        <textarea placeholder="Расскажите что нибудь о себе" class="about-user__text" id="sayAboutYou" ></textarea>
    </div>
    `;
}

function differentCss(file, findCssFiles) {
  const head = document.head;
  const existingLinks = head.querySelectorAll('link[rel="stylesheet"]');

  findCssFiles.forEach((el) => {
    const existingLink = Array.from(existingLinks).find(
      (link) => link.getAttribute("href") === `styles/${el}.css`
    );
    if (existingLink) {
      existingLink.setAttribute("href", `styles/${file}.css`);
      head.appendChild(existingLink);
    }
  });
}
