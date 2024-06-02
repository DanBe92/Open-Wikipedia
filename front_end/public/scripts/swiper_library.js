
var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    },
    pagination: {
        el: ".swiper-pagination",
    },
    loop: true,
});


const swiperWrapper = document.querySelector('.swiper-wrapper');


// Fetch all articles from same user account

(async () => {
    const response = await fetch('http://localhost:8000/getUserArticles', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    const articlesObjectList = await response.json();

    console.log(articlesObjectList);

    articlesObjectList.forEach( articleData => {

        const swiperSlideDiv = document.createElement('div');
        swiperSlideDiv.className = 'swiper-slide';

        swiperSlideDiv.onclick = () => {
            localStorage.removeItem('articleUrl');
            localStorage.removeItem('fullArticleData');
            localStorage.setItem('fullArticleData', JSON.stringify(articleData));
            window.location.href = `/users/${user.id}/read_article/`
        };

        const slideTitle = document.createElement('h3');
        slideTitle.className = '"text-xl"';
        slideTitle.textContent = articleData.title;
        swiperSlideDiv.appendChild(slideTitle);

        const slideImg = document.createElement('img');
        slideImg.src = articleData.urlImage;
        swiperSlideDiv.appendChild(slideImg);

        swiperWrapper.appendChild(swiperSlideDiv);
    });
})();