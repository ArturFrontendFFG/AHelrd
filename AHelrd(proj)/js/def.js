import Router from "./modules/Router.js";
const faPencil = document.querySelector(`.fa-pencil`)



if (!localStorage.getItem(`token`) || localStorage.getItem(`token`) === "undefined") {
  faPencil.style.display = 'none'
  localStorage.removeItem(`favoriteData`);
}else{
  faPencil.style.display = 'block';



}

const main = document.querySelector('.main');
const header = document.querySelector('.header');
const logo = document.querySelector('.logo');
let lastScroll = 0;
const defaultOffset = 40;
main.style.marginTop = `${header.clientHeight + 10}px`;

const headerTop = () => {
  header.style.top = `${logo.clientHeight}px`;
};

const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
const containHide = () => logo.classList.contains('hide');

headerTop();

window.addEventListener('scroll', () => {
  if (scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
    header.style.top = '0';
    logo.classList.add('hide');
  } else if (scrollPosition() < lastScroll && containHide()) {
    headerTop();
    logo.classList.remove('hide');
  }
  lastScroll = scrollPosition();
});

window.addEventListener(`click`, (e) => {
  const target = e.target

  const profileBtn = target.closest(`.fa-user`);
  const profileContent = document.querySelector(`.profile__content`);
  const favoriteBtn = target.closest(`.fa-heart`);
  if(profileBtn){
    if (!localStorage.getItem(`token`) || localStorage.getItem(`token`) === "undefined"){
      profileContent.classList.toggle(`active`);
    }else{
      location.hash = "#profile"
    }
  }else if(favoriteBtn){
    if (!localStorage.getItem(`token`) || localStorage.getItem(`token`) === "undefined"){
        location.hash = "#login"
    }else{
      location.hash = "#favorite"
    }
  }
  
})

try {
  Router.init();
} catch (error) {
  console.error(error);
}