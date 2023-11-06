import {
    ACCESS_KEY,
    searchBar,
    searchInput,
    footerTitle,
    searchLoadingIcon,
    clearButton,
    searchValue,
    searchButton,
    gallery,
    zoomInCard,
} from './vars.js'

let currentPage = 1

searchInput.focus()

async function getData() {
    try {
        const query = searchValue()
        clearButton.classList.remove('clear-button--visible')
        searchLoadingIcon.classList.add('search-loading--visible')
        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&per_page=60&page=${currentPage}&client_id=${ACCESS_KEY}`
        )
        const data = await res.json()
        searchLoadingIcon.classList.remove('search-loading--visible')
        clearButton.classList.add('clear-button--visible')
        data.results.forEach((pic) => {
            gallery.innerHTML += `<img src="${pic.urls.regular}" alt="" class="photo-card" />`
        })
        currentPage++
        zoomInClick()
        zoomOutClick()
    } catch (error) {
        searchInput.value = 'Error, try again later...'
    }
}

clearButton.addEventListener('click', function () {
    searchInput.value = ''
})

searchButton.addEventListener('click', function () {
    gallery.innerHTML = ''
    currentPage = 1
    getData()
})

searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        gallery.innerHTML = ''
        currentPage = 1
        getData()
    }
})

window.addEventListener('scroll', function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        getData()
    }

    if (searchBar.getBoundingClientRect().top < 0) {
        searchBar.classList.add('search-wrapper--fixed')
    } else if (footerTitle.getBoundingClientRect().top > -100) {
        searchBar.classList.remove('search-wrapper--fixed')
    }
})

function zoomInClick() {
    const photos = document.querySelectorAll('.photo-card')
    photos.forEach((photo) => {
        photo.addEventListener('click', () => {
            const imagePath = photo.src
            document.body.classList.add('lock-scroll')
            zoomInCard.classList.add('zoom-in-card--visible')
            zoomInCard.innerHTML = `<div class="zoom-in-card__container">
                                        <img src="${imagePath}" alt="" class="zoom-in-card__photo" />
                                        <a class="download-button"
                                            href = "${imagePath}"
                                            download = "dzhepeg${Math.floor(
                                                Math.random() * 1000 + 1
                                            )}.jpg"
                                        >
                                            <img src="./assets/img/download.svg" alt="" class="download-button__icon" />
                                        </a>
                                    </div>`
        })
    })
}

zoomInClick()

function zoomOutClick() {
    const zoomInCard = document.querySelector('.zoom-in-card')

    zoomInCard.addEventListener('click', (event) => {
        const zoomInCardPhoto = document.querySelector('.zoom-in-card__photo')
        if (event.target !== zoomInCardPhoto) {
            zoomInCard.classList.remove('zoom-in-card--visible')
            document.body.classList.remove('lock-scroll')
        }
    })
}

zoomOutClick()
