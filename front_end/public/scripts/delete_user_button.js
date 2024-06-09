// User Delete

function userDelete(userId) {

    fetch(`http://localhost:8000/user`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId
        })
    })
        .then(res => res.json())
        .then(user => {
            if (user.message) {
                alertHandler(user.message);
            } else {
                localStorage.clear();
                alertHandler(`The ${user.firstName}'s account has been deleted.`, 'Action Success');
                document.querySelector('#alertButton').onclick = () => {
                    alertModal.close();
                    localStorage.clear();
                    window.location.href = '/homepage';
                };
            }
        })
}

const tdDeleteUserButton = document.querySelector('#deleteUserButton');

tdDeleteUserButton.addEventListener('click', () => {
    confirmModal.showModal();
    document.querySelector('#confirmTitle').textContent = "Action Required";
    document.querySelector('#confirmMessage').textContent = "This action will DELETE your account. Confirm to proceed.";
    document.querySelector('#confirmButton').onclick = () => {
        confirmModal.close();
        userDelete(user.id);
    }
});
