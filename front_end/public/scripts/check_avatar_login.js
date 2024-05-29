
if (user) {
    document.querySelector('#signUpList').style.display = "none";
    document.querySelector('#loginList').style.display = "none";
    document.querySelector('#profileList').style.display = "block";
    document.querySelector('#logoutList').style.display = "block";
} else {
    document.querySelector('#signUpList').style.display = "block";
    document.querySelector('#loginList').style.display = "block";
    document.querySelector('#profileList').style.display = "none";
    document.querySelector('#logoutList').style.display = "none";
}