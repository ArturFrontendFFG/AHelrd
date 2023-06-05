export default async function registrationModule() {
    const form = document.querySelector(`.registration`);
    const password = document.querySelector(`#password`);
    const confirmPassword = document.querySelector(`#confirm-password`);
    const email = document.querySelector(`#email`);
    const nikname = document.querySelector(`#nikname`);
    const btn = document.querySelector(`.registration__btn`);
    if (confirmPassword) {
        let dataRegistr = {}
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

        btn.addEventListener(`click`, (e) => {
            e.preventDefault();
            dataRegistr = {
                username: nikname.value,
                email: email.value,
                password: password.value
            }
            try {
                fetch("http://localhost:9090/auth/register", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataRegistr)
                })
                    .then(res => res.json())
                    .then(data => console.log(data));
            } catch (e) {
                console.log(e);
            }

        })

    }
    if (btn.dataset.type === 'login') {
        btn.addEventListener(`click`, () => {
            const obj = {
                username: nikname.value,
                password: password.value
            }
            fetch('http://localhost:9090/auth/authenticate', {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(obj)
            })
                .then(res => res.json())
                .then(data => localStorage.setItem(`token`, data.jwt))
                .catch(e => console.error(e));
            form.style.color = "#000";
            form.style.backgroundColor = "transparent";
            form.style.boxShadow = "0 0 0";
            form.style.fontSize = "38px";
            form.innerHTML = 'Сейчас пройдет перенаправление на главную страницу';
            setTimeout(() => {
                location.hash = "#post";
            }, 3000);
        })
    }
    window.addEventListener(`click`, (e) => {
        const eye = e.target.closest(`.fa-eye-slash`);
        if (eye) {
            eye.classList.toggle(`fa-eye`);
            eye.classList.contains(`fa-eye`) ? eye.previousElementSibling.type = 'text' : eye.previousElementSibling.type = 'password';
        }
    })
}


