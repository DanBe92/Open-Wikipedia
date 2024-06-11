
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



function checkValidation(validation) {
    Object.keys(validation).forEach(key => setError(document.querySelector(`input[name=${key}]`), validation[key]))
}



function setError(el, messages) {
    el.style.border = '1px solid red';
    messages.reverse().forEach(message => {
        const span = document.createElement('span');
        span.textContent = message;
        span.classList.add('inputError');
        span.style.color = 'red';
        el.parentNode.insertBefore(span, el.nextSibling);
    })
}



function cleanErrors() {

    document.querySelectorAll('.inputError').forEach((element) => {
        element.previousElementSibling.style.border = ''
        element.remove();
    })

}



function formValidation(firstName, lastName, email) {

    const validation = validate({
        firstName,
        lastName,
        email
    }, {
        firstName: {
            length: { minimum: 3 }
        },
        lastName: {
            length: { minimum: 3 }
        },
        email: {
            email: true
        },
    })

    return validation
}



function updateUser() {

    userModal.showModal();
    cleanErrors();

    document.querySelector('input[name=firstName]').value = user.firstName;
    document.querySelector('input[name=lastName]').value = user.lastName;
    document.querySelector('input[name=email]').value = user.email;
}



const userForm = document.querySelector('#userForm')

userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    cleanErrors();

    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    const email = e.target[2].value;

    const validation = formValidation(firstName, lastName, email)


    if (validation) {
        checkValidation(validation);
        return
    }

    fetch(`${localhost}/user`, {

        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: user.id,
            firstName,
            lastName,
            email
        })
    })

        .then(res => res.json())
        .then(data => {

            if (data.isError) {
                checkValidation(data.error);
                return
            }

            localStorage.setItem('user', JSON.stringify(data));
            alertHandler("Profile succesfully updated", 'Action Success');
            document.querySelector('#alertButton').onclick = () => {
                alertModal.close();
                window.location.reload();
            };    
        })
})
