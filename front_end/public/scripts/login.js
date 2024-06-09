
const loginForm = document.querySelector('#loginForm');

function loginFormValidation(loginEmail, loginPassword) {

    const validation = validate({
        loginEmail,
        loginPassword
    }, {
        loginEmail: {
            email: true
        },
        loginPassword: {
            length: { minimum: 8 }
        }
    })

    return validation
};


loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    cleanErrors();

    const loginEmail = e.target.children[0].value.toLowerCase();
    const loginPassword = e.target.children[1].value;

    const loginValidation = loginFormValidation(loginEmail, loginPassword);

    if (loginValidation) {
        checkValidation(loginValidation);
        return
    }

    const res = await fetch('http://localhost:8000/login', {
        body: JSON.stringify({
            loginEmail,
            loginPassword
        }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (res.status !== 200) {
        const error = await res.json();
        checkValidation(error);
        return
    }

    const data = await res.json();

    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);

    window.location.href = `/user`
})