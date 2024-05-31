
(async () => {
    const response = await fetch(`http://localhost:8000/users/${user.id}`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },

        }
    )

    if (response.status !== 200) {
        alert('Bruh')
        localStorage.clear();
        window.location.href = '/homepage';
    } else {
        const user = await response.json();
        console.log("Login Effettuato");
        const span1 = document.querySelector('#user')
        span1.textContent = user.firstName;
        const span2 = document.querySelector('#firstName')
        span2.textContent = user.firstName;
        const span3 = document.querySelector('#lastName')
        span3.textContent = user.lastName;
        const span4 = document.querySelector('#email')
        span4.textContent = user.email;
    }

    

    

})();
