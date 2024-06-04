// User Delete

function userDelete() {

    fetch(`http://localhost:8000/users`, { method: 'DELETE' })
        .then(res => res.json())
        .then(user => {
            if (user.message) {
                alert(user.message);
            } else {
                localStorage.clear();
                alert(`The ${user.firstName}'s account has been deleted.`);
                window.location.href = '/homepage';
            }
        })
}


const tdDeleteUserButton = document.querySelector('#deleteUserButton');

tdDeleteUserButton.setAttribute('name', `${user.id}`);

tdDeleteUserButton.addEventListener('click', (event) => {

    if (confirm("This action will DELETE your account. Confirm to proceed.") == false) {
        event.preventDefault();
    } else {
        userDelete()
    }
})
