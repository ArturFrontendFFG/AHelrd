export default async function registrationModule(){
    const password = document.querySelector(`#password`);
    const confirmPassword = document.querySelector(`#confirm-password`);
    const email = document.querySelector(`#email`);
    const nikname = document.querySelector(`#nikname`);
    let data = {}
    password.addEventListener('input', () => {
        const value = password.value.trim();
        value.length < 6 ? password.setCustomValidity('Минимальная длина - 6 символов') : password.setCustomValidity('');
    });
    if (confirmPassword !== null) {
        const btn = document.querySelector(`.registration__btn`);
        confirmPassword.addEventListener(`input`, () => {
            if (password.value !== confirmPassword.value) {
                confirmPassword.setCustomValidity(`Пароли не совпадают`);
                btn.setAttribute(`disabled`, '');
                btn.style.cursor = 'no-drop';
            } else {
                confirmPassword.setCustomValidity(``);
                btn.removeAttribute(`disabled`);
                btn.style.cursor = 'pointer';
            }
        })
    }
}
window.addEventListener(`click`, (e) => {
    const eye = e.target.closest(`.fa-eye-slash`);
    if(eye){
        eye.classList.toggle(`fa-eye`);
        eye.classList.contains(`fa-eye`) ? eye.previousElementSibling.type = 'text' : eye.previousElementSibling.type = 'password';
    }
})