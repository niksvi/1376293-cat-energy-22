document.body.classList.add('js-enabled');
const menuToggler = document.querySelector('.main-nav__toggle');
const mainMenu = document.querySelector('.main-nav__list');
menuToggler.classList.remove('main-nav__toggle--hidden');
mainMenu.classList.add('main-nav__list--close');

menuToggler.addEventListener('click', showHideMenu);

function showHideMenu() {
  menuToggler.classList.toggle('main-nav__toggle--close')
    mainMenu.classList.toggle('main-nav__list--close');
}
