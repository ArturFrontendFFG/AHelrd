export default async function registrationModule() {
    const password = document.querySelector(`#password`);
    const confirmPassword = document.querySelector(`#confirm-password`);
    const email = document.querySelector(`#email`);
    const nikname = document.querySelector(`#nikname`);
    password.addEventListener('input', () => {
        const value = password.value.trim();
        value.length < 6 ? password.setCustomValidity('Минимальная длина - 6 символов') : password.setCustomValidity('');
    });
    if (confirmPassword !== null) {
        let dataRegistr = {}

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

        btn.addEventListener(`click`, (e) => {
            e.preventDefault();
            dataRegistr = {
                username: nikname.value,
                email: email.value,
                password: password.value
            }
            try{
                fetch("http://localhost:9090/auth/register", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataRegistr)
                })
                    .then(res => res.json())
                    .then(data => console.log(data));
            }catch(e){
                console.log(e);
            }

        })

    }
    const logBtn = document.querySelector(`.registration__btn`);
    if (logBtn.innerText === 'Войти') {

        logBtn.addEventListener(`click`, (e) => {
            let dataAuthenticate = {
                username: email.value,
                password: password.value  
            }
            // e.preventDefault();
            // fetch('http://localhost:9090/user/get/all')
            //     .then(res => res.json())
            //     .then(data => {
            //         data.forEach(el => {

            //             if(email.value == el.email){
            //                 console.log(el);
            //             }
            //         });
            //     })

            fetch("http://localhost:9090/auth/authenticate", {
                method: "POST",
                headers: {
                'Content-Type': 'application/json'
            },
                body: JSON.stringify(dataAuthenticate)
            })
            .then(res => res.json())
            .then(data => console.log(data));
    })
}
}
window.addEventListener(`click`, (e) => {
    const eye = e.target.closest(`.fa-eye-slash`);
    if (eye) {
        eye.classList.toggle(`fa-eye`);
        eye.classList.contains(`fa-eye`) ? eye.previousElementSibling.type = 'text' : eye.previousElementSibling.type = 'password';
    }
})