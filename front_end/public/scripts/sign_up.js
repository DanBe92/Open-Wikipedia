const signUpModal = document.querySelector('#signUpModal');

function openModals(modalName, modalForm) {
    modalName.showModal();
    cleanErrors();
    modalForm.reset();
};


function checkValidation(validation) {
    Object.keys(validation).forEach(key => setError(document.querySelector(`input[name=${key}]`), validation[key]))
};


function setError(el, messages) {
    el.style.border = '1px solid red';
    messages.reverse().forEach(message => {
        const span = document.createElement('span');
        span.textContent = message;
        span.classList.add('inputError');
        span.style.color = 'red';
        el.parentNode.insertBefore(span, el.nextSibling);
    })
};


function cleanErrors() {
    document.querySelectorAll('.inputError').forEach((element) => {
        element.previousElementSibling.style.border = ''
        element.remove();
    })
};


function formValidation(firstName, lastName, email, password, passwordConfirmation) {

    const validation = validate({
        firstName,
        lastName,
        email,
        password,
        passwordConfirmation
    }, {
        firstName: {
            presence: { allowEmpty: false },
            length: { minimum: 3 }
        },
        lastName: {
            presence: { allowEmpty: false },
            length: { minimum: 3 }
        },
        email: {
            email: true
        },
        password: {
            length: { minimum: 8 }
        },
        passwordConfirmation: {
            length: { minimum: 8 },
            equality: {
                attribute: "password",
                message: "Password doesn't match"
            }
        }
    })

    return validation
};


// Sign Up

const signUpForm = document.querySelector('#signUpForm')

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    cleanErrors();

    const firstNameTag = e.target[0]
    const lastNameTag = e.target[1]
    const emailTag = e.target[2]
    const passwordTag = e.target[3]
    const passwordConfirmationTag = e.target[4]

    const firstName = firstNameTag.value;
    const lastName = lastNameTag.value;
    const email = emailTag.value;
    const password = passwordTag.value;
    const passwordConfirmation = passwordConfirmationTag.value;

    const signUpValidation = formValidation(firstName, lastName, email, password, passwordConfirmation)


    if (signUpValidation) {
        checkValidation(signUpValidation);
        return
    }

    const url = 'http://127.0.0.1:8000/users';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            passwordConfirmation
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Data", data);
            if (data.isError) {
                checkValidation(data.error);
                return
            }
            signUpModal.close();
        })

})