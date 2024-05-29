
const user = JSON.parse(localStorage.getItem("user"));

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
        console.log("Data", user);
        const span = document.querySelector('#user')
        span.textContent = user.firstName;
    }

    

    

})();
