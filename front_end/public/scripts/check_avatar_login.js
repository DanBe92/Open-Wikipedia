
let user = JSON.parse(localStorage.getItem('user'));

(async () => {
    const response = await fetch(`http://localhost:8000/user`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
        }
    )

    if (response.status !== 200) {
        alert('Session Expired') // Sostituire con un modale magari
        localStorage.clear();
        window.location.href = '/homepage';
    } else {
        document.querySelector('#signUpList').style.display = "none";
        document.querySelector('#loginList').style.display = "none";
        document.querySelector('#profileList').style.display = "block";
        document.querySelector('#logoutList').style.display = "block";

        document.querySelector('#footerLogin').style.display = "none";
        document.querySelector('#footerLogout').style.display = "block";
        document.querySelector('#footerSignUp').style.display = "none";
        document.querySelector('#footerProfile').style.display = "block";
    }

})();