
if (user) {

    const span1 = document.querySelector('#user')
    span1.textContent = user.firstName;

    const span2 = document.querySelector('#firstName')
    span2.textContent = user.firstName;

    const span3 = document.querySelector('#lastName')
    span3.textContent = user.lastName;

    const span4 = document.querySelector('#email')
    span4.textContent = user.email;
}
