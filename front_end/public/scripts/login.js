
const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.children[0].value;
    const password = e.target.children[1].value;

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
        console.log('Error');
        return
    }

    const data = await res.json();

    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);

    window.location.href = `/users/${data.user.id}`
})