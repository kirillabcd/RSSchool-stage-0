import { songs } from './data.js'
const backgrounds = document.querySelectorAll('.dec')

let currentSong = 0
let isSeeking = false
let updateInterval

const music = document.querySelector('.audio')

// song info
const songAuthor = document.querySelector('.song-info__author')
const songName = document.querySelector('.song-info__track')

// controls
const playBtn = document.querySelector('.controls__play-song-button')
const prevBtn = document.querySelector('.controls__prev-song-button')
const nextBtn = document.querySelector('.controls__next-song-button')
// seek bar & timing el-s
const seekBar = document.querySelector('.timeline__song-seek')
const currentTime = document.querySelector('.timeline__current-time')
const songDuration = document.querySelector('.timeline__song-duration')

// info slider
const infoButton = document.querySelector('.info__button')
const infoSlider = document.querySelector('.info__row')

// cover slider
const coversRow = document.querySelector('.album-cover__covers-row')
fillAlbumCovers()
const covers = document.querySelectorAll('.album-cover__item')

const firstCoverClone = covers[0].cloneNode(true)
const lastCoverClone = covers[covers.length - 1].cloneNode(true)

coversRow.append(firstCoverClone)
coversRow.prepend(lastCoverClone)

function fillAlbumCovers() {
    songs.forEach((song) => {
        coversRow.innerHTML += `
        <img
            src="${song.cover}"
            alt=""
            class="album-cover__item"
            />
        `
    })
}

const toggleAnimation = () => {
    backgrounds.forEach((item) => {
        item.classList.toggle('animated')
    })
}

playBtn.addEventListener('click', () => {
    playBtn.classList.toggle('controls__play-song-button--paused')
    if (playBtn.classList.contains('controls__play-song-button--paused')) {
        music.pause()
        toggleAnimation()
    } else {
        music.play()
        toggleAnimation()
    }
})

const playMusic = () => {
    playBtn.classList.remove('controls__play-song-button--paused')
    music.play()
}

const handleTime = (input) => {
    let minutes = Math.floor(input / 60)
    let seconds = Math.floor(input % 60)
    let formatedMinutes = String(minutes).padStart(2, '0')
    let formatedSeconds = String(seconds).padStart(2, '0')

    return `${formatedMinutes}:${formatedSeconds}`
}

const handleMusic = (i) => {
    seekBar.value = 0
    let song = songs[i]
    currentSong = i
    music.src = song.path
    music.addEventListener('loadeddata', () => {
        seekBar.max = music.duration
    })
    songAuthor.textContent = `${song.author}`
    songName.textContent = `${song.song}`
    // backgroundWrapper.style.backgroundImage = `url(${song.background})`
}

handleMusic(0)

function starInterval() {
    if (!isSeeking) {
        updateInterval = setInterval(() => {
            seekBar.value = music.currentTime
            currentTime.textContent = `${handleTime(music.currentTime)}`
            songDuration.textContent = `-${handleTime(music.duration - music.currentTime)}`

            if (Math.floor(music.currentTime) == Math.floor(seekBar.max)) {
                nextBtn.click()
            }
        }, 1000)
    }
}

seekBar.addEventListener('mousedown', () => {
    isSeeking = true
    clearInterval(updateInterval)
})

seekBar.addEventListener('mouseup', () => {
    music.currentTime = seekBar.value
    isSeeking = false
    starInterval()
})

starInterval()

nextBtn.addEventListener('click', () => {
    currentSong++

    coversRow.style.transition = 'all 0.3s ease'
    coversRow.style.transform = `translateX(-${(300 + 20) * (currentSong + 1)}px)`

    backgrounds.forEach((item) => {
        item.classList.add('animated')
    })

    if (currentSong >= songs.length) {
        coversRow.addEventListener(
            'transitionend',
            () => {
                coversRow.style.transition = 'none'
                currentSong = 0
                coversRow.style.transform = `translateX(-${(300 + 20) * (currentSong + 1)}px)`
                handleMusic(currentSong)
                playMusic()
            },
            { once: true }
        ) // eventlistener works once
    } else {
        handleMusic(currentSong)
        playMusic()
    }
})

prevBtn.addEventListener('click', () => {
    currentSong--

    coversRow.style.transition = 'all 0.3s ease'
    coversRow.style.transform = `translateX(-${(300 + 20) * (currentSong + 1)}px)`

    backgrounds.forEach((item) => {
        item.classList.add('animated')
    })

    if (currentSong < 0) {
        coversRow.addEventListener(
            'transitionend',
            () => {
                coversRow.style.transition = 'none'
                currentSong = songs.length - 1
                coversRow.style.transform = `translateX(-${(300 + 20) * (currentSong + 1)}px)`
                handleMusic(currentSong)
                playMusic()
            },
            { once: true }
        )
    } else {
        handleMusic(currentSong)
        playMusic()
    }
})

infoButton.addEventListener('click', () => infoSlider.classList.toggle('info__row--visible'))
