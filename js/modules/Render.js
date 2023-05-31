import newPostModule from '../newPost.js';
import registrationModule from '../reg.js';
export default async function Controller(routeName) {
    let wrapper = document.querySelector('.wrapper');
    const cssFiles = ['main', `login`, `newPost`, 'profile', `courses`];
    switch (routeName) {
        case 'login':
            removeAllChildren(wrapper)
            login(wrapper);
            registrationModule();
            differentCss(`login`, cssFiles);
            break;
        case 'favorite':
            removeAllChildren(wrapper);
            differentCss(`main`, cssFiles);
            window.scrollBy(0, 0)
            let getPosts = JSON.parse(localStorage.getItem('favoriteData'));
            const heartCounter = document.querySelector(`.profile__counter`);
            const newTitle = document.createElement(`h2`);
            if (getPosts && getPosts.length > 0) {
                const newTitle = document.createElement(`h2`)
                newTitle.classList.add('favorite-title');
                newTitle.innerHTML = 'Избранное';
                getPosts.forEach((post) => {
                    renderFavorite(wrapper, post);
                    wrapper.prepend(newTitle);
                });
                heartCounter.innerHTML = getPosts.length;

                wrapper.addEventListener("click", ({ target }) => {
                    const closeBtn = target.closest("box-icon");
                    if (closeBtn) {
                        const postEl = target.closest(".post")
                        deleteFavouritePost(postEl, getPosts, heartCounter)
                    };
                });
            } else {
                localStorage.removeItem(`favoriteData`);
                removeAllChildren(wrapper);
                newTitle.classList.add(`favorite-title`);
                newTitle.innerHTML = `Вы еще ничего не добавили в избранное`;
                wrapper.append(newTitle);
            }
            break;
        case 'registration':
            removeAllChildren(wrapper);
            registration(wrapper);
            registrationModule();
            differentCss(`login`, cssFiles);
            break;
        case 'new':
            removeAllChildren(wrapper);
            newPost(wrapper);
            newPostModule();
            differentCss(`newPost`, cssFiles);
            break;
        case 'profile':
            removeAllChildren(wrapper);
            differentCss(`profile`, cssFiles);
            profile(wrapper);
            break;
        default:
            removeAllChildren(wrapper);
            differentCss(`main`, cssFiles);
            window.scrollBy(0, 0);
            async function getPost() {
                const response = await fetch(`https://api.tvmaze.com/shows`, { method: "GET" });
                const dataPost = await response.json();
                const result = dataPost.filter((el, i) => i < 20);
                renderPost(result, wrapper)
            }
            await getPost()
            basket();
    };
};

function removeAllChildren(dataContainer) {
    dataContainer.querySelectorAll('*').forEach((node) => node.remove());
}
function renderFavorite(dataContainer, post) {
    let newFavoritePost = document.createElement('div');
    newFavoritePost.classList.add('post');
    newFavoritePost.dataset.id = post.id;
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
    posts.forEach(el => {
        const newPost = document.createElement(`div`);
        newPost.classList.add(`post`);
        newPost.innerHTML = `
        <div class="post__profile">
            ${el.id}
        </div>
        <a class="post__title" href="#">
            ${el.name}
        </a>
        <img class="post__image" src="${el.image.original}" alt="">
        <p class="post__text text">${el.summary.replace(/<\/?p>|<\/?b>/g, "")}</p>
        <a class="post__btn btn" href="#">
            Читать далее
        </a> 
        <box-icon name='heart' type='solid'></box-icon>
        `
        wrapper.prepend(newPost)
    })
}
function basket() {
    const posts = document.getElementsByClassName(`post`);
    const heartCounter = document.querySelector(`.profile__counter`);
    if (posts.length > 0) {
        for (let i = 0; i < posts.length; i++) {
            posts[i].setAttribute(`data-id`, `${i}`);
            posts[i].querySelector(`box-icon[name='heart']`).setAttribute("data-cart", "");
        }
        window.addEventListener(`click`, (e) => {
            if (e.target.hasAttribute('data-cart')) {
                e.preventDefault();
                const post = event.target.closest(`.post`);
                let heart = post.querySelector(`box-icon[name='heart']`);
                let favoriteData = [];
                localStorage.getItem(`favoriteData`) ? favoriteData = JSON.parse(localStorage.getItem(`favoriteData`)) : '';
                const updateLocal = () => {
                    localStorage.setItem("favoriteData", JSON.stringify(favoriteData));
                };
                let dataPost = {
                    id: post.dataset.id,
                    author: post.querySelector(`.post__profile`).innerText,
                    imgSrc: post.querySelector(`.post__image`).src,
                    description: post.querySelector(`.post__text`).innerHTML,
                    title: post.querySelector(`.post__title`).innerText,
                }
                favoriteData.push(dataPost)
                heart.classList.add(`active`);
                heartCounter.innerHTML = favoriteData.length;
                updateLocal()
            }
        })
    }

    const favoriteData = JSON.parse(localStorage.getItem(`favoriteData`));
    if (favoriteData && favoriteData.length > 0) {
        heartCounter.innerHTML = favoriteData.length;
        Array.from(posts).forEach((item) => {
            const isData = favoriteData.find((obj) => obj.id === item.dataset.id)
            if (isData) {
                const heart = item.querySelector(`box-icon`)
                heart.classList.add(`active`);
            }
        })
    }
}
function login(wrapper) {
    const form = document.createElement(`form`);
    form.className = 'registration'
    form.innerHTML = `
    <h3 class="registration__title">
        Вход
    </h3>
    <div class="registration__box">
        <label class="registration__clue" for="email">
            E-mail
        </label>
        <input class="registration__inp" required type="email" id="email">
    </div>
    <div class="registration__box">
    <label class="registration__clue" for="password">
        Пароль
    </label>
    <input class="registration__inp" required type="password" id="password">
    <i class="fa-solid fa-eye-slash"></i>
    </div>
    <button class="registration__btn" type="submit">
        Войти
    </button>
    <div class="if-login">
        Ещё нет аккаунта?
        <a href="#registration">Зарегистрируйтесь</a>
    </div>
    `
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
    `
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
function differentCss(file, findCssFiles) {
    const head = document.head;
    const existingLinks = head.querySelectorAll('link[rel="stylesheet"]');
    
    findCssFiles.forEach(el => {
      const existingLink = Array.from(existingLinks).find(link => link.getAttribute('href') === `styles/${el}.css`);
      if (existingLink) {
        existingLink.setAttribute('href', `styles/${file}.css`);
        head.appendChild(existingLink);
      }
    });
}