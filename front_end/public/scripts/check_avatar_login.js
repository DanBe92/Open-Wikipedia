const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    document.querySelector('#signUpList').style.display = "none";
    document.querySelector('#loginList').style.display = "none";
    document.querySelector('#profileList').style.display = "block";
    document.querySelector('#logoutList').style.display = "block";

    document.querySelector('#footerLogin').style.display = "none";
    document.querySelector('#footerLogout').style.display = "block";
    document.querySelector('#footerSignUp').style.display = "none";
    document.querySelector('#footerProfile').style.display = "block";

} else {
    document.querySelector('#signUpList').style.display = "block";
    document.querySelector('#loginList').style.display = "block";
    document.querySelector('#profileList').style.display = "none";
    document.querySelector('#logoutList').style.display = "none";

    document.querySelector('#footerLogin').style.display = "block";
    document.querySelector('#footerLogout').style.display = "none";
    document.querySelector('#footerSignUp').style.display = "block";
    document.querySelector('#footerProfile').style.display = "none";
}