
const loginForm = document.querySelector('#loginForm');

function loginFormValidation(email, password) {

    const validation = validate({
        email,
        password
    }, {
        email: {
            email: true
        },
        password: {
            length: { minimum: 8 }
        }
    })

    return validation
};


loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    cleanErrors();

    const email = e.target.children[0].value;
    const password = e.target.children[1].value;

    const loginValidation = loginFormValidation(email, password)

    if (loginValidation) {
        const el = document.querySelector('input[name=password]')
        el.style.border = '1px solid red';
        const span = document.createElement('span');
        span.classList.add('inputError');
        span.style.color = 'red';
        el.parentNode.insertBefore(span, el.nextSibling);
        return
    }

    const res = await fetch('http://localhost:8000/login', {
        body: JSON.stringify({
            email,
            password
        }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (res.status !== 200) {
        const error = await res.json();
        console.log("Error:", error);

        const el = document.querySelector('input[name=password]')
        const span = document.createElement('span');
        span.textContent = error.message;
        span.classList.add('inputError');
        span.style.color = 'red';
        el.parentNode.insertBefore(span, el.nextSibling);
        return
    }

    const data = await res.json();

    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);

    window.location.href = `/users/${data.user.id}`
})