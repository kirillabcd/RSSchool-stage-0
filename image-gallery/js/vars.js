const ACCESS_KEY = 'gAtbrLKayogZAmXQM3xhHH0IvhhYy97IxqKupLfAxac'
const searchInput = document.querySelector('.search-input')

const searchValue = function () {
    const searchInput = document.querySelector('.search-input')
    return searchInput.value
}

const searchBar = document.querySelector('.search-wrapper')
const footerTitle = document.querySelector('.title')
const clearButton = document.querySelector('.clear-button')
const searchLoadingIcon = document.querySelector('.search-loading')

const searchButton = document.querySelector('.search-button')
const gallery = document.querySelector('.photo-cards')
const photos = document.querySelectorAll('.photo-card')
const zoomInCard = document.querySelector('.zoom-in-card')

export {
    ACCESS_KEY,
    searchBar,
    searchInput,
    footerTitle,
    searchLoadingIcon,
    clearButton,
    searchValue,
    searchButton,
    gallery,
    photos,
    zoomInCard,
}
