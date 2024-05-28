
fetch(`http://localhost:8000/users/${user.id}`,
    {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        
    }
)
.then(res => res.json())
.then(user => {
    const span = document.querySelector('#user')
    span.textContent = user.firstName;
});