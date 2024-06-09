
let user = JSON.parse(localStorage.getItem('user'));

function alertHandler(alertMessage, alertTitle = "Something is Wrong") {
    alertModal.showModal();
    document.querySelector('#alertTitle').textContent = alertTitle;
    document.querySelector('#alertMessage').textContent = alertMessage;
    document.querySelector('#alertButton').onclick = () => {
        alertModal.close();
    };
};

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
        alertModal.showModal();
        document.querySelector('#alertTitle').textContent = 'Session Expired';
        document.querySelector('#alertMessage').textContent = "You'll be redirect to the homepage for the log in";
        document.querySelector('#alertButton').onclick = () => {
            alertModal.close();
            localStorage.clear();
            window.location.href = '/homepage';
        };
        return
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