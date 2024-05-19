
const body = document.querySelector('body')

document.querySelector('#search-button')
    .addEventListener('click', (e) => {
        e.preventDefault();

        const search_query = document.querySelector('#search-input').value;

        fetch(`https://it.wikipedia.org/w/rest.php/v1/search/page?` + new URLSearchParams({
            q: search_query,
            limit: 3,
        }))
            .then(response => response.json())
            .then(data => {
                console.log(data['pages'][0]['key']);

            


                const div = document.createElement('div');
                data['pages'].forEach(page => {

                    fetch('https://it.wikipedia.org/wiki/' + page['key'] + "?origin=*", {
                        headers: {
                        'Content-Type': 'application/json',
                        }
                    })
                        .then(response => response.json())
                        .then(data => console.log(data))


                            // const p = document.createElement('p');
                            // p.textContent = page['title'];
                            // div.appendChild(p);
            })
            // body.appendChild(div)
        })

})

