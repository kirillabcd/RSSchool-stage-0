let isFlipped = false
let cardsOpened = 0
let score = 0
let matches = 0
let firstCard, secondCard
let messageTimeOut
let scoreArray = []

if (!localStorage.getItem('scoreArray')) {
    localStorage.setItem('scoreArray', JSON.stringify(scoreArray))
}

const cardsBox = document.querySelector('.cards-box')
const scoreField = document.querySelector('.score-value')
const gameBody = document.querySelector('.game-body')
const scoreTable = document.querySelector('.score-table')
const newGameBtn = document.querySelector('.play-again-btn')

let icons = [
    { data: 'darkthrone', src: 'dark-throne.png' },
    { data: 'mayhem', src: 'mayhem.png' },
    { data: 'malevolent_creation', src: 'malevolent-creation.png' },
    { data: 'deicide', src: 'deicide.png' },
    { data: 'death', src: 'death.png' },
    { data: 'desaster', src: 'desaster.png' },
    { data: 'benediction', src: 'benediction.png' },
    { data: 'visceral_decay', src: 'visceral-decay.png' },
]

let funnyFacts = {
    mayhem: 'This is the logo of Mayhem band, their frontman committed suicide at the age of 22 and their guitarist was killed at 25',
    death: 'I have no funny fact about this band cuz I cannot even read the name from the logo. Could you?',
    darkthrone:
        'IT`S MATCH! In my opinion, the DARKTHRONE logo is one of the most beautiful,agree?',
    visceral_decay: 'This one looks like your code',
    desaster: 'Ye, these guys really love Satan',
    win: '',
}

function handleCards() {
    let doubledIcons = icons.map((el) => [el, el]).flat()
    doubledIcons.sort(() => Math.random() - 0.5)
    cardsBox.innerHTML = ''
    doubledIcons.forEach((icon) => {
        cardsBox.innerHTML += `<div class="card" data-icon="${icon.data}">
                                    <img class="frontside" src="./logos/${icon.src}" alt="logo">
                                    <div class="backside"></div>
                                </div>`
    })
}

handleCards()

const cards = document.querySelectorAll('.card')

cards.forEach((card) => {
    card.addEventListener('click', flipCard)
})

function flipCard() {
    if (cardsOpened < 2) {
        this.classList.add('flip')

        if (isFlipped === false) {
            cardsOpened++
            isFlipped = true
            firstCard = this
            return
        } else if (this !== firstCard) {
            cardsOpened++
            score++
            scoreField.textContent = `${score}`
            secondCard = this
            checkMatch()
        }
    } else {
        return
    }
}

function checkMatch() {
    if (firstCard.dataset.icon === secondCard.dataset.icon) {
        setTimeout(() => {
            firstCard.classList.add('matched')
            secondCard.classList.add('matched')
        }, 500)

        firstCard.removeEventListener('click', flipCard)
        secondCard.removeEventListener('click', flipCard)
        matches++
        isFlipped = false
        cardsOpened = 0

        if (
            firstCard.getAttribute('data-icon') === 'mayhem' &&
            secondCard.getAttribute('data-icon') === 'mayhem' &&
            matches < 8
        ) {
            throwMessage('mayhem')
        }

        if (
            firstCard.getAttribute('data-icon') === 'death' &&
            secondCard.getAttribute('data-icon') === 'death' &&
            matches < 8
        ) {
            throwMessage('death')
        }

        if (
            firstCard.getAttribute('data-icon') === 'visceral_decay' &&
            secondCard.getAttribute('data-icon') === 'visceral_decay' &&
            matches < 8
        ) {
            throwMessage('visceral_decay')
        }

        if (
            firstCard.getAttribute('data-icon') === 'darkthrone' &&
            secondCard.getAttribute('data-icon') === 'darkthrone' &&
            matches < 8
        ) {
            throwMessage('darkthrone')
        }

        if (
            firstCard.getAttribute('data-icon') === 'desaster' &&
            secondCard.getAttribute('data-icon') === 'desaster' &&
            matches < 8
        ) {
            throwMessage('desaster')
        }

        if (matches === 8) {
            endGame()
        }
        return
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flip')
            secondCard.classList.remove('flip')
            isFlipped = false
            cardsOpened = 0
        }, 1000)
    }
}

function throwMessage(textKey) {
    const messageBubble = document.querySelector('.decor-message-bubble')
    if (messageTimeOut) {
        clearTimeout(messageTimeOut)
    }
    const messageText = document.querySelector('.decor-message-text')
    messageBubble.classList.add('decor-message-bubble--visible')
    messageText.textContent = `${funnyFacts[textKey]}`
    messageTimeOut = setTimeout(() => {
        messageBubble.classList.remove('decor-message-bubble--visible')
    }, 10000)
}

function endGame() {
    funnyFacts.win = `You matched all the logos in ${score} moves!`
    throwMessage('win')
    scoreArray = JSON.parse(localStorage.getItem('scoreArray'))
    scoreArray.push(score)
    if (scoreArray.length > 10) {
        scoreArray.shift()
    }
    scoreTable.innerHTML = ''
    scoreArray.forEach((scoreItem, index) => {
        scoreTable.innerHTML += `<tr>
                                    <td>${index + 1}</td>
                                    <td>${scoreItem}</td>
                                </tr>`
    })
    localStorage.setItem('scoreArray', JSON.stringify(scoreArray))
    setTimeout(() => {
        gameBody.classList.add('flip')
    }, 3000)
}

newGameBtn.addEventListener('click', newGame)

function newGame() {
    isFlipped = false
    cardsOpened = 0
    score = 0
    matches = 0
    scoreArray = []
    scoreField.textContent = `${score}`
    handleCards()
    const cards = document.querySelectorAll('.card')

    cards.forEach((card) => {
        card.classList.remove('flip')
        card.classList.remove('matched')
        card.addEventListener('click', flipCard)
    })

    gameBody.classList.remove('flip')
}
