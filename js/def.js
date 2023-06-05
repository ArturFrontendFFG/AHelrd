import Router from "./modules/Router.js";

const main = document.querySelector('.main');
const header = document.querySelector('.header');
const logo = document.querySelector('.logo');
let lastScroll = 0;
const defaultOffset = 40;
main.style.marginTop = `${header.clientHeight + 35}px`;

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

const profileBtn = document.querySelector('.fa-user');
const profileContent = document.querySelector('.profile__content');

profileBtn.addEventListener('click', () => {
  profileContent.classList.toggle('active');
});

try {
  Router.init();
} catch (error) {
  console.error(error);
}
