document.addEventListener('DOMContentLoaded', function () {
    // Burger-menu
    const burgerButton = document.querySelector('.header__burger-icon');
    burgerButton.addEventListener('click', handleBurger);

    function handleBurger(event) {
        const burgerMenu = document.querySelector('.header__menu-sections');
        const menuItems = document.querySelectorAll('.header__menu-link');
        const welcomeGreet = document.querySelector('.welcome__greetings');
        const burgerOverlay = document.querySelector('.burger-overlay');

        // toggle menu, overlay,  lock/unlock scroll,  add animation to greet text and burger button
        function toggleBurgerClasses() {
            burgerButton.classList.toggle('open');
            burgerMenu.classList.toggle('open');
            burgerOverlay.classList.toggle('open');
            document.body.classList.toggle('lock-scroll');
            welcomeGreet.classList.toggle('hide');
        }

        toggleBurgerClasses();

        // Close burger clicking menu links
        menuItems.forEach((item) => {
            item.addEventListener('click', handleBurgerLinks);
        });

        function handleBurgerLinks(event) {
            if (burgerMenu.classList.contains('open') && event.target.closest('.header__menu-link')) {
                toggleBurgerClasses();
            }
        }

        // Close burger clicking overlay
        document.addEventListener('click', handleBurgerOverlay);

        function handleBurgerOverlay(event) {
            if (
                burgerOverlay.classList.contains('open') &&
                !event.target.closest('.header__menu-sections') &&
                !event.target.closest('.header__burger-icon')
            ) {
                toggleBurgerClasses();
            }
        }
    }

    // Season tabs

    const radioButtons = document.querySelectorAll('.favorites__radio-item');

    window.addEventListener('resize', handleHeight);
    handleHeight();

    radioButtons.forEach((radioButton, buttonIndex) => {
        radioButton.addEventListener('click', () => {
            handleTabs(buttonIndex);
        });
    });

    function handleTabs(index) {
        const cards = document.querySelectorAll('.favorites__card-items');

        function showCard() {
            cards.forEach((card, cardIndex) => {
                if (cardIndex === index) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        }

        function closeCard() {
            cards.forEach((card) => {
                card.classList.remove('active');
            });
        }

        closeCard();
        setTimeout(showCard, 500);
    }

    function handleHeight() {
        const activeCard = document.querySelector('.favorites__card-items.active');
        const cardsBox = document.querySelector('.favorites__card-wrapper');
        let height = 0;
        height += activeCard.clientHeight;
        cardsBox.style.height = `${height}px`;
    }

    //Slider

    function slider() {
        const sliderContainer = document.querySelector('.about__carousel-wrapper');
        const sliderRow = document.querySelector('.about__carousel');
        const sliderItem = document.querySelectorAll('.carousel__item');
        const nextButton = document.querySelector('.next-button');
        const prevButton = document.querySelector('.prev-button');
        const paginationButtons = document.querySelectorAll('.pagination__button');

        let itemWidth = 0; // Width of every item + gap 25px
        let numberOfVisibleItems = 0;
        let counter = 0;

        function updateSliderPosition() {
            itemWidth = sliderItem[0].offsetWidth + 25;
            numberOfVisibleItems = Math.floor(sliderContainer.offsetWidth / sliderItem[0].offsetWidth);
            const newPosition = -itemWidth * counter;
            sliderRow.style.left = `${newPosition}px`;
        }

        function setArrowsStatus() {
            if (counter < 1) {
                prevButton.classList.add('unavailable');
                nextButton.classList.remove('unavailable');
            } else if (counter === sliderItem.length - numberOfVisibleItems) {
                nextButton.classList.add('unavailable');
                prevButton.classList.remove('unavailable');
            } else {
                nextButton.classList.remove('unavailable');
                prevButton.classList.remove('unavailable');
            }
        }

        updateSliderPosition();
        setArrowsStatus();

        function setActivePaginationButton() {
            paginationButtons.forEach((button, index) => {
                button.classList.toggle('active', index === counter);
            });
        }

        function increaseCounter() {
            if (counter < sliderItem.length - numberOfVisibleItems - 1) {
                counter++;
            } else {
                counter = sliderItem.length - numberOfVisibleItems;
            }
        }

        function decreaseCounter() {
            if (counter >= 1) {
                counter--;
            } else if (counter < 1) {
                counter = 0;
            }
        }

        nextButton.addEventListener('click', () => {
            increaseCounter();
            setActivePaginationButton();
            updateSliderPosition();
            setArrowsStatus();
        });

        prevButton.addEventListener('click', () => {
            decreaseCounter();
            setActivePaginationButton();
            updateSliderPosition();
            setArrowsStatus();
        });

        paginationButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                counter = index;
                setActivePaginationButton();
                updateSliderPosition();
                setArrowsStatus();
            });
        });

        window.addEventListener('resize', () => {
            counter = Math.min(counter, sliderItem.length - numberOfVisibleItems);
            updateSliderPosition();
            setActivePaginationButton();
            setArrowsStatus();
        });

        if (screen.width < 966) {
            // startX/Y - touch point axis X/Y
            // distX/Y - distance between startX/Y on touchstart event and touchend

            let startX = 0;
            let startY = 0;
            let distX = 0;
            let distY = 0;

            // startTime - time of touchstart
            //  elapsedTime - time between touchstart and touchend
            let startTime = 0;
            let elapsedTime = 0;

            // threshold - min distX to slide items
            // restraint - min distY to slide items
            // allowedTime - min elapsedTime to  slide items
            let threshold = 80;
            let restraint = 100;
            let allowedTime = 200;

            sliderRow.addEventListener('touchstart', function (e) {
                let touchObj = e.changedTouches[0];
                startX = touchObj.pageX;
                startY = touchObj.pageY;
                startTime = new Date().getTime();
                e.preventDefault();
            });

            sliderRow.addEventListener('touchmove', function (e) {
                e.preventDefault();
            });

            sliderRow.addEventListener('touchend', function (e) {
                let touchObj = e.changedTouches[0];
                distX = touchObj.pageX - startX;
                distY = touchObj.pageY - startY;
                elapsedTime = new Date().getTime() - startTime;

                if (elapsedTime >= allowedTime) {
                    if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                        if (distX > 0) {
                            decreaseCounter();
                            updateSliderPosition();
                            setActivePaginationButton();
                            setArrowsStatus();
                        } else {
                            increaseCounter();
                            updateSliderPosition();
                            setActivePaginationButton();
                            setArrowsStatus();
                        }
                    }
                }
            });
        }
    }
    slider();

    // Drop-down menu

    // Get button & menu
    const profileButton = document.querySelector('.header__menu-profile-button');
    const dropMenu = document.querySelector('.profile-menu');

    // Use function when clicking button
    profileButton.addEventListener('click', handleDropDown);

    // Open/ Close dd menu function
    function handleDropDown(event) {
        function toggleMenu(event) {
            dropMenu.classList.toggle('open');
        }

        toggleMenu();

        function menuOverlayCloser() {
            document.addEventListener('click', (event) => {
                if (
                    dropMenu.classList.contains('open') &&
                    !event.target.closest('.header__menu-profile-button') &&
                    !event.target.closest('.profile-menu')
                ) {
                    dropMenu.classList.remove('open');
                }
            });
        }

        menuOverlayCloser();
    }

    // Modals

    // 1. Register & login modals

    // Get all open buttons
    const logInButtons = document.querySelectorAll('.link-log-in');
    const registerButtons = document.querySelectorAll('.link-register');

    // Get all forms
    const registerForm = document.querySelector('.modal__window-register');
    const loginForm = document.querySelector('.modal__window-log-in');
    const subscribeForm = document.querySelector('.modal__window-subscription');

    // Toggle & switch register modal
    registerButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            // condition 1: if user unregistered or unathorised
            if (
                localStorage.getItem('userRegistered') !== 'true' ||
                localStorage.getItem('userAuthorised') !== 'true'
            ) {
                toggleModal(registerForm);
            }
        });
    });

    // Toggle and switch login modal
    logInButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            // condition 2: if user unathorised
            if (localStorage.getItem('userAuthorised') !== 'true') {
                toggleModal(loginForm);
            }
        });
    });

    // 2. "Buy" books buttons

    // Get all buy books buttons
    const buyButtons = document.querySelectorAll('.favorites__card-button');

    buyButtons.forEach((button, buttonIndex) => {
        button.addEventListener('click', (event) => {
            // stopper**condition 2: if user unathorised open log-in modal
            if (localStorage.getItem('userAuthorised') !== 'true') {
                toggleModal(loginForm);
            }
            // stopper**condition 3: authorised but unsubscribed
            else if (
                localStorage.getItem('userAuthorised') === 'true' &&
                localStorage.getItem('userSubscribed') !== 'true'
            ) {
                toggleModal(subscribeForm);
                // Buy subscription

                // Get submit button inside form
                const subscribeButton = document.querySelector('.subscription-button');
                subscribeButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    handleSubscribe();
                });

                function handleSubscribe() {
                    // Get all inputs
                    const subscrBankNum = document.querySelector('.bank-number');
                    const subscrExpDateFirst = document.querySelector('.expiration-code-first');
                    const subscrExpDateSec = document.querySelector('.expiration-code-second');
                    const subscrCvc = document.querySelector('.CVC');
                    const subscrCardholder = document.querySelector('.cardholder');
                    const subscrPostCode = document.querySelector('.postal-code');
                    const subscrCity = document.querySelector('.city');

                    // Get all error messages
                    const subscrBankNumError = document.querySelector('.input-error-bank-card');
                    const subscrExpDateError = document.querySelector('.input-error-exp-code');
                    const subscrCvcError = document.querySelector('.input-error-cvc');
                    const subscrCardholderError = document.querySelector('.input-error-cardholder');
                    const subscrPostCodeError = document.querySelector('.input-error-postcode');
                    const subscrCityError = document.querySelector('.input-error-city');

                    // Get all inputs vallues
                    let subscrBankNumValue = subscrBankNum.value.split(' ').join('');
                    let subscrExpDateFirstValue = subscrExpDateFirst.value.split(' ').join('');
                    let subscrExpDateSecValue = subscrExpDateSec.value.split(' ').join('');
                    let subscrCvcValue = subscrCvc.value.split(' ').join('');
                    let subscrCardholderValue = subscrCardholder.value.split(' ').join('');
                    let subscrPostCodeValue = subscrPostCode.value.split(' ').join('');
                    let subscrCityValue = subscrCity.value.split(' ').join('');

                    // Form validation

                    isSubscribeError = false;

                    if (subscrBankNumValue === '') {
                        subscrBankNum.classList.add('error');
                        subscrBankNumError.classList.add('visible');
                        subscrBankNumError.textContent = 'Fill the field, please';
                        isSubscribeError = true;
                    } else if (subscrBankNumValue.length !== 16) {
                        subscrBankNum.classList.add('error');
                        subscrBankNumError.classList.add('visible');
                        subscrBankNumError.textContent = 'Bank card number must be 16 characters';
                        isSubscribeError = true;
                    } else {
                        subscrBankNum.classList.remove('error');
                        subscrBankNumError.classList.remove('visible');
                        subscrBankNumError.textContent = '';
                    }

                    if (subscrExpDateFirstValue === '' || subscrExpDateSecValue === '') {
                        subscrExpDateFirst.classList.add('error');
                        subscrExpDateSec.classList.add('error');
                        subscrExpDateError.classList.add('visible');
                        subscrExpDateError.textContent = 'Fill the fields, please';
                        isSubscribeError = true;
                    } else if (subscrExpDateFirstValue.length !== 2 || subscrExpDateSecValue.length !== 2) {
                        subscrExpDateFirst.classList.add('error');
                        subscrExpDateSec.classList.add('error');
                        subscrExpDateError.classList.add('visible');
                        subscrExpDateError.textContent = 'Expiration dates should be 2 characters each';
                        isSubscribeError = true;
                    } else {
                        subscrExpDateFirst.classList.remove('error');
                        subscrExpDateSec.classList.remove('error');
                        subscrExpDateError.classList.remove('visible');
                        subscrExpDateError.textContent = '';
                    }

                    if (subscrCvcValue === '') {
                        subscrCvc.classList.add('error');
                        subscrCvcError.classList.add('visible');
                        subscrCvcError.textContent = 'Fill the field, please';
                        isSubscribeError = true;
                    } else if (subscrCvcValue.length !== 3) {
                        subscrCvc.classList.add('error');
                        subscrCvcError.classList.add('visible');
                        subscrCvcError.textContent = 'CVC must be 3 characters';
                        isSubscribeError = true;
                    } else {
                        subscrCvc.classList.remove('error');
                        subscrCvcError.classList.remove('visible');
                        subscrCvcError.textContent = '';
                    }

                    if (subscrCardholderValue === '') {
                        subscrCardholder.classList.add('error');
                        subscrCardholderError.classList.add('visible');
                        subscrCardholderError.textContent = 'Fill the field, please';
                        isSubscribeError = true;
                    } else if (subscrCardholderValue.length < 5) {
                        subscrCardholder.classList.add('error');
                        subscrCardholderError.classList.add('visible');
                        subscrCardholderError.textContent = 'Cardholder name should be at leasr 5 characters';
                        isSubscribeError = true;
                    } else {
                        subscrCardholder.classList.remove('error');
                        subscrCardholderError.classList.remove('visible');
                        subscrCardholderError.textContent = '';
                    }

                    if (subscrPostCodeValue === '') {
                        subscrPostCode.classList.add('error');
                        subscrPostCodeError.classList.add('visible');
                        subscrPostCodeError.textContent = 'Fill the field, please';
                        isSubscribeError = true;
                    } else if (subscrPostCodeValue.length !== 6) {
                        subscrPostCode.classList.add('error');
                        subscrPostCodeError.classList.add('visible');
                        subscrPostCodeError.textContent = 'Post code must be 6 characters';
                        isSubscribeError = true;
                    } else {
                        subscrPostCode.classList.remove('error');
                        subscrPostCodeError.classList.remove('visible');
                        subscrPostCodeError.textContent = '';
                    }

                    if (subscrCityValue === '') {
                        subscrCity.classList.add('error');
                        subscrCityError.classList.add('visible');
                        subscrCityError.textContent = 'Fill the field, please';
                        isSubscribeError = true;
                    } else {
                        subscrCity.classList.remove('error');
                        subscrCityError.classList.remove('visible');
                        subscrCityError.textContent = '';
                    }

                    if (isSubscribeError === true) {
                    } else {
                        const modal = document.querySelector('.modal');
                        const modalOverlay = document.querySelector('.modal__overlay');

                        modal.classList.remove('open');
                        modalOverlay.classList.remove('open');
                        subscribeForm.classList.remove('open');
                        document.body.classList.remove('lock-scroll');

                        subscribeUser();
                    }

                    function subscribeUser() {
                        ownedBooksArray = JSON.parse(localStorage.getItem('ownedBooksArray'));
                        ownedBooksArray.push(buttonIndex);
                        localStorage.setItem('ownedBooksArray', JSON.stringify(ownedBooksArray));

                        const bookNameAndAuthor = document.querySelectorAll('.favorites__card-name');
                        bookNameAndAuthor.forEach((bookName, bookIndex) => {
                            if (bookIndex === buttonIndex) {
                                booksNamesArray = JSON.parse(localStorage.getItem('booksNamesArray'));
                                booksNamesArray.push(
                                    bookName.textContent.replace(/\s+/g, ' ').replace(/ By /i, ', ')
                                );
                                localStorage.setItem('booksNamesArray', JSON.stringify(booksNamesArray));
                            }
                        });

                        let userBooks = localStorage.getItem('userBooks');
                        userBooks++;
                        localStorage.setItem('userBooks', userBooks);

                        localStorage.setItem('userSubscribed', true);
                        location.reload();
                    }
                }

                // Store book index to LS, store book name to LS, put book name to profile modal
            } else if (
                localStorage.getItem('userAuthorised') === 'true' &&
                localStorage.getItem('userSubscribed') === 'true'
            ) {
                button.classList.add('own');
                button.textContent = 'Own';
                let userBooks = localStorage.getItem('userBooks');
                userBooks++;
                localStorage.setItem('userBooks', userBooks);
                const profileBooksCounter = document.querySelector('.profile-info__books-count');
                profileBooksCounter.textContent = userBooks;
                const cardBookCounter = document.querySelector('.library-cards__books-count');
                cardBookCounter.textContent = userBooks;

                ownedBooksArray = JSON.parse(localStorage.getItem('ownedBooksArray'));
                ownedBooksArray.push(buttonIndex);
                localStorage.setItem('ownedBooksArray', JSON.stringify(ownedBooksArray));

                const bookNameAndAuthor = document.querySelectorAll('.favorites__card-name');
                bookNameAndAuthor.forEach((bookName, bookIndex) => {
                    if (bookIndex === buttonIndex) {
                        booksNamesArray = JSON.parse(localStorage.getItem('booksNamesArray'));
                        booksNamesArray.push(
                            bookName.textContent.replace(/\s+/g, ' ').replace(/ By /i, ', ')
                        );
                        localStorage.setItem('booksNamesArray', JSON.stringify(booksNamesArray));

                        let profileBookMarkUp = booksNamesArray
                            .map((book) => `<li class="rented-books-item">${book}</li>`)
                            .join('');

                        const profileBooksList = document.querySelector('.rented-books-list');
                        profileBooksList.innerHTML = profileBookMarkUp;
                    }
                });
            }
        });
    });

    // Check owned buttons from LS
    function setBooksButtonsStatus() {
        ownedBooksArray = JSON.parse(localStorage.getItem('ownedBooksArray'));

        buyButtons.forEach((button, buttonIndex) => {
            if (
                localStorage.getItem('userAuthorised') === 'true' &&
                localStorage.getItem('userSubscribed') === 'true'
            ) {
                for (let i = 0; i < ownedBooksArray.length; i++) {
                    if (ownedBooksArray[i] === buttonIndex) {
                        button.classList.add('own');
                        button.textContent = 'Own';
                    }
                }
            } else {
                button.classList.remove('own');
                button.textContent = 'Buy';
            }
        });
    }

    setBooksButtonsStatus();

    function setBooksListInProfile() {
        if (
            localStorage.getItem('userAuthorised') === 'true' &&
            localStorage.getItem('userSubscribed') === 'true'
        ) {
            booksNamesArray = JSON.parse(localStorage.getItem('booksNamesArray'));

            let profileBookMarkUp = booksNamesArray
                .map((book) => `<li class="rented-books-item">${book}</li>`)
                .join('');

            const profileBooksList = document.querySelector('.rented-books-list');
            profileBooksList.innerHTML = profileBookMarkUp;
        }
    }

    setBooksListInProfile();

    // 3. My profile modal

    // Get open button
    const myProfileBtns = document.querySelectorAll('.link-my-profile');
    const myProfileForm = document.querySelector('.modal__window-profile');
    // Open from open button

    myProfileBtns.forEach((button) => {
        button.addEventListener('click', (event) => {
            toggleModal(myProfileForm);
        });
    });

    // Modal toggler
    function toggleModal(modalForm) {
        // Two more buttons for switching between modals
        const logInSwith = document.querySelector('.link-log-in-switch');
        const registerSwith = document.querySelector('.link-register-switch');

        const modal = document.querySelector('.modal');
        const modalOverlay = document.querySelector('.modal__overlay');
        const closeButtons = document.querySelectorAll('.close-button');

        // Open modal by button
        function openModal(event) {
            if (!modalForm.classList.contains('open')) {
                modal.classList.add('open');
                modalOverlay.classList.add('open');
                modalForm.classList.add('open');
                document.body.classList.add('lock-scroll');
                dropMenu.classList.remove('open');
            }
        }
        openModal();

        // Close by overlay
        modalOverlay.addEventListener('click', closeModal);

        // Close by X
        closeButtons.forEach((button) => {
            button.addEventListener('click', closeModal);
        });

        function closeModal(event) {
            if (modalForm.classList.contains('open')) {
                modal.classList.remove('open');
                modalOverlay.classList.remove('open');
                modalForm.classList.remove('open');
                document.body.classList.remove('lock-scroll');
            }
        }

        logInSwith.addEventListener('click', (event) => {
            registerForm.classList.remove('open');
            loginForm.classList.add('open');
        });

        registerSwith.addEventListener('click', (event) => {
            registerForm.classList.add('open');
            loginForm.classList.remove('open');
        });
    }

    // 4 Check the card

    // get check the card button
    const checkTheCardBtn = document.querySelector('.library-cards__submit');

    checkTheCardBtn.addEventListener('click', (event) => {
        event.preventDefault();
        handleCardCheck();
    });

    function handleCardCheck() {
        if (
            localStorage.getItem('userRegistered') === 'true' &&
            localStorage.getItem('userAuthorised') === 'false'
        ) {
            const readersName = document.querySelector('.form-name');
            const readersCardNumber = document.querySelector('.form-number');
            const buttonOption = document.querySelector('.library-cards__submit-wrapper');
            const profileOption = document.querySelector('.library-cards__profile-items-wrapper');

            let readersNameValue = readersName.value.split(' ').join('');
            let readersCardNumberValue = readersCardNumber.value.split(' ').join('');

            const storedName = `${localStorage.getItem('userName')}${localStorage.getItem('userLastName')}`;
            const storedCardNumber = `${localStorage.getItem('cardNumber')}`;

            const cardsVisitCounter = document.querySelector('.library-cards__visits-count');
            const cardsBooksCounter = document.querySelector('.library-cards__books-count');

            cardsVisitCounter.textContent = `${localStorage.getItem('userVisitCounter')}`;
            cardsBooksCounter.textContent = `${localStorage.getItem('userBooks')}`;

            if (readersNameValue !== storedName || readersCardNumberValue !== storedCardNumber) {
                console.log('error');
            } else {
                buttonOption.classList.add('hidden');
                profileOption.classList.remove('hidden');

                setTimeout(() => {
                    buttonOption.classList.remove('hidden');
                    profileOption.classList.add('hidden');
                    readersName.value = '';
                    readersCardNumber.value = '';
                }, 10000);
            }
        }
    }
    // Registration

    // Get SUBMIT button inside form
    const submitRegistration = document.querySelector('.register-submit');
    // Listen button, validate forms
    submitRegistration.addEventListener('click', (event) => {
        handleRegistration(event);
    });

    function handleRegistration(event) {
        // Get all inputs from register form
        const firstName = document.querySelector('.first-name-reg');
        const lastName = document.querySelector('.last-name-reg');
        const eMail = document.querySelector('.email-reg');
        const password = document.querySelector('.password-reg');
        // Get all errorfields from register form
        const firstNameError = document.querySelector('.input-error-name');
        const lastNameError = document.querySelector('.input-error-surname');
        const eMailError = document.querySelector('.input-error-email');
        const passwordError = document.querySelector('.input-error-password');
        // Get all values
        let firstNameValue = firstName.value.split(' ').join('');
        let lastNameValue = lastName.value.split(' ').join('');
        let eMailValue = eMail.value.toLowerCase().split(' ').join('');
        let passwordValue = password.value.split(' ').join('');

        // Cancel standart submit
        event.preventDefault();

        // Function toggle error classes and shows text of error
        function throwRegInputError(inputName, errorText) {
            inputName.classList.add('error');
            if (inputName === firstName) {
                firstNameError.textContent = errorText;
                firstNameError.classList.add('visible');
            }

            if (inputName === lastName) {
                lastNameError.textContent = errorText;
                lastNameError.classList.add('visible');
            }

            if (inputName === eMail) {
                eMailError.textContent = errorText;
                eMailError.classList.add('visible');
            }

            if (inputName === password) {
                passwordError.textContent = errorText;
                passwordError.classList.add('visible');
            }
        }
        function registerValidation() {
            // Is Error? flag
            let isErrorReg = false;

            // FIRST NAME validation
            if (firstNameValue === '') {
                throwRegInputError(firstName, 'Fill the field, please.');
                isErrorReg = true;
            } else if (firstNameValue.length < 3) {
                throwRegInputError(firstName, 'Name should be at least 3 characters');
                isErrorReg = true;
            }
            // Put value to LS
            else {
                firstNameValue = `${firstNameValue[0].toUpperCase()}${firstNameValue.slice(1).toLowerCase()}`;
                localStorage.setItem('userName', firstNameValue);
                firstName.classList.remove('error');
                firstNameError.classList.remove('visible');
            }
            // LAST NAME validation
            if (lastNameValue === '') {
                throwRegInputError(lastName, 'Fill the field, please.');
                isErrorReg = true;
            } else if (lastNameValue.length < 3) {
                throwRegInputError(lastName, 'Surname should be at least 3 characters');
                isErrorReg = true;
            }
            // Put value to LS
            else {
                lastNameValue = `${lastNameValue[0].toUpperCase()}${lastNameValue.slice(1).toLowerCase()}`;
                localStorage.setItem('userLastName', lastNameValue);
                lastName.classList.remove('error');
                lastNameError.classList.remove('visible');
            }

            // EMAIL validation
            if (eMailValue === '') {
                throwRegInputError(eMail, 'Fill the field, please.');
                isErrorReg = true;
            } else if (eMailValue.length < 3) {
                throwRegInputError(eMail, 'E-mail should be at least 3 characters');
                isErrorReg = true;
            } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+$/.test(eMailValue)) {
                throwRegInputError(eMail, 'E-mail format incorrect');
                isErrorReg = true;
            }
            // Put value to LS
            else {
                localStorage.setItem('userMail', eMailValue);
                eMail.classList.remove('error');
                eMailError.classList.remove('visible');
            }
            // PASSWORD validation
            if (passwordValue === '') {
                throwRegInputError(password, 'Fill the field, please.');
                isErrorReg = true;
            } else if (passwordValue.length < 8) {
                throwRegInputError(password, 'Password should be at least 8 symbols');
                isErrorReg = true;
            } else {
                localStorage.setItem('userPassword', passwordValue);
                password.classList.remove('error');
                passwordError.classList.remove('visible');
            }

            // Stop if error
            if (isErrorReg === true) {
                return;

                // Continue if succes
            } else {
                const modal = document.querySelector('.modal');
                const modalOverlay = document.querySelector('.modal__overlay');

                modal.classList.remove('open');
                modalOverlay.classList.remove('open');
                registerForm.classList.remove('open');
                document.body.classList.remove('lock-scroll');

                registerUser();
                // Set logged status to user drop down menu & my profile
                toggleDropDownlogged();
                toggleMyProfileLogged();
                toggleLibraryCardsLogged();
            }
        }
        registerValidation();

        function registerUser() {
            // Reset visits counter to 1
            localStorage.removeItem.userVisitCounter;
            let userVisitCounter = 1;
            localStorage.setItem('userVisitCounter', userVisitCounter);

            localStorage.setItem('userAuthorised', true);
            localStorage.setItem('userRegistered', true);
            localStorage.setItem('userSubscribed', false);
            localStorage.setItem('userBooks', 0);
            let ownedBooksArray = [];
            let booksNamesArray = [];
            localStorage.setItem('ownedBooksArray', JSON.stringify(ownedBooksArray));
            localStorage.setItem('booksNamesArray', JSON.stringify(booksNamesArray));

            // Generate 16n
            let cardNumber = (Math.floor(Math.random() * 900000000) + 100000000).toString(16).toUpperCase();
            while (cardNumber.length < 9) {
                cardNumber = '0' + cardNumber;
            }
            // Add to LS as card number
            localStorage.setItem('cardNumber', cardNumber);
        }
    }

    // Set logged status to user drop down menu and profile modal
    toggleDropDownlogged();
    toggleMyProfileLogged();
    toggleLibraryCardsLogged();
    // Function to set logged status for user drop down menu

    function toggleDropDownlogged() {
        const logInDropDown = document.querySelector('.profile-set-log-in');
        const loggedDropDown = document.querySelector('.profile-set-logged');
        const logInIcon = document.querySelector('.menu-profile-logo--login');
        const loggedIcon = document.querySelector('.menu-profile-logo--logged');
        const loggedInitials = document.querySelector('.profile-logo__initials');

        if (
            localStorage.getItem('userRegistered') === 'true' &&
            localStorage.getItem('userAuthorised') === 'true'
        ) {
            logInDropDown.classList.add('hidden');
            loggedDropDown.classList.remove('hidden');

            const loggedDropDowmTitle = document.querySelector('.profile-menu__title-logged');
            loggedDropDowmTitle.textContent = `${localStorage.getItem('cardNumber')}`;

            let initials = `${localStorage.getItem('userName')[0]}${localStorage.getItem('userLastName')[0]}`;
            loggedInitials.textContent = initials;

            logInIcon.classList.add('hidden');
            loggedIcon.classList.remove('hidden');
        }
    }

    // Fill profile modal
    function toggleMyProfileLogged() {
        if (
            localStorage.getItem('userRegistered') === 'true' &&
            localStorage.getItem('userAuthorised') === 'true'
        ) {
            const profileUserInitials = document.querySelector('.user-icon-initials');
            const profileUserName = document.querySelector('.user-name');
            const profileVisitsCount = document.querySelector('.profile-info__visits-count');
            const profileOwnedBooks = document.querySelector('.profile-info__books-count');
            const profileCardNumber = document.querySelector('.card-number__card-number');

            profileUserInitials.textContent = `${localStorage.getItem('userName')[0]}${
                localStorage.getItem('userLastName')[0]
            }`;
            profileUserName.textContent = `${localStorage.getItem('userName')} ${localStorage.getItem(
                'userLastName'
            )}`;

            profileVisitsCount.textContent = `${localStorage.getItem('userVisitCounter')}`;
            profileOwnedBooks.textContent = `${localStorage.getItem('userBooks')}`;
            profileCardNumber.textContent = `${localStorage.getItem('cardNumber')}`;
        }
    }

    function toggleLibraryCardsLogged() {
        if (
            localStorage.getItem('userRegistered') === 'true' &&
            localStorage.getItem('userAuthorised') === 'true'
        ) {
            const libraryCardsHeader = document.querySelector('.library-cards__form-header');
            const libraryCardsHeaderLogged = document.querySelector('.library-cards__form-header-authorised');

            const buttonOption = document.querySelector('.library-cards__submit-wrapper');
            const profileInfoOptionLogged = document.querySelector('.library-cards__profile-items-wrapper');

            const authorisationBox = document.querySelector('.library-cards__not-authorised-box');
            const authorisedBox = document.querySelector('.library-cards__authorised-box');

            const nameInput = document.querySelector('.form-name');
            const cardInput = document.querySelector('.form-number');

            const cardVisitCount = document.querySelector('.library-cards__visits-count');
            const cardBookCount = document.querySelector('.library-cards__books-count');

            libraryCardsHeader.classList.add('hidden');
            buttonOption.classList.add('hidden');
            authorisationBox.classList.add('hidden');

            libraryCardsHeaderLogged.classList.remove('hidden');
            profileInfoOptionLogged.classList.remove('hidden');
            authorisedBox.classList.remove('hidden');

            nameInput.value = `${localStorage.getItem('userName')} ${localStorage.getItem('userLastName')}`;
            cardInput.value = `${localStorage.getItem('cardNumber')}`;

            nameInput.disabled = true;
            cardInput.disabled = true;

            cardVisitCount.textContent = `${localStorage.getItem('userVisitCounter')}`;
            cardBookCount.textContent = `${localStorage.getItem('userBooks')}`;
        }
    }

    // Log-in

    // Get submit button inside log-in form
    const logInSubmit = document.querySelector('.login-submit');

    logInSubmit.addEventListener('click', handleLogIn);

    // Login handler function

    function handleLogIn(event) {
        // Cancel standart submit
        event.preventDefault();

        const logInMailOrCardNum = document.querySelector('.email-card-login');
        const logInPassword = document.querySelector('.password-login');

        const logInMailOrCardNumError = document.querySelector('.input-error-email-card');
        const logInPasswordError = document.querySelector('.input-error-password-login');

        let logInMailOrCardNumValue = logInMailOrCardNum.value.split(' ').join('');
        let logInPasswordValue = logInPassword.value.split(' ').join('');

        let isErrorLogIn = false;

        function checkRegisterUser() {
            if (logInMailOrCardNumValue === '') {
                logInMailOrCardNumError.textContent = 'Fill the field, please';
                logInMailOrCardNumError.classList.add('visible');
                logInPasswordError.classList.remove('active');
                logInMailOrCardNum.classList.add('error');
                isErrorLogIn = true;
            } else if (
                logInMailOrCardNumValue !== localStorage.getItem('userMail') &&
                logInMailOrCardNumValue !== localStorage.getItem('cardNumber')
            ) {
                logInMailOrCardNumError.textContent = 'User Email or Card Number not found';
                logInMailOrCardNumError.classList.add('visible');
                logInPasswordError.classList.remove('active');
                logInMailOrCardNum.classList.add('error');
                isErrorLogIn = true;
            } else {
                logInMailOrCardNumError.classList.remove('active');
                logInMailOrCardNumError.textContent = '';
                logInMailOrCardNum.classList.remove('error');

                if (logInPasswordValue === '') {
                    logInPasswordError.textContent = 'Fill the field, please';
                    logInPasswordError.classList.add('visible');
                    logInPassword.classList.add('error');

                    isErrorLogIn = true;
                } else if (logInPasswordValue !== localStorage.getItem('userPassword')) {
                    logInPasswordError.textContent = 'Password incorrect';
                    logInPasswordError.classList.add('visible');
                    logInPassword.classList.add('error');
                    isErrorLogIn = true;
                } else {
                    logInPasswordError.textContent = '';
                    logInPasswordError.classList.remove('visible');
                    logInPassword.classList.remove('error');
                }
            }

            if (isErrorLogIn === true) {
                return;
            } else {
                const modal = document.querySelector('.modal');
                const modalOverlay = document.querySelector('.modal__overlay');

                modal.classList.remove('open');
                modalOverlay.classList.remove('open');
                loginForm.classList.remove('open');
                document.body.classList.remove('lock-scroll');

                logInUser();
                toggleDropDownlogged();
                toggleMyProfileLogged();
                toggleLibraryCardsLogged();
                location.reload();
            }
        }

        checkRegisterUser();

        function logInUser() {
            localStorage.setItem('userAuthorised', true);
            let userVisitCounter = localStorage.getItem('userVisitCounter');
            userVisitCounter++;
            localStorage.setItem('userVisitCounter', userVisitCounter);
        }
    }

    // Log-out

    const logOutButton = document.querySelector('.link-log-out');

    logOutButton.addEventListener('click', handleLogOut);

    function handleLogOut(event) {
        localStorage.setItem('userAuthorised', false);
        toggleDropDownLoggedOut();
        location.reload();
    }

    function toggleDropDownLoggedOut() {
        const logInDropDown = document.querySelector('.profile-set-log-in');
        const loggedDropDown = document.querySelector('.profile-set-logged');
        const logInIcon = document.querySelector('.menu-profile-logo--login');
        const loggedIcon = document.querySelector('.menu-profile-logo--logged');

        logInDropDown.classList.add('open');
        loggedDropDown.classList.remove('open');
        logInIcon.classList.add('open');
        loggedIcon.classList.remove('open');
    }

    // copy to clipBoard

    function copyToClipboard() {
        const copyText = document.querySelector('.card-number__card-number').textContent;
        const textarea = document.createElement('textarea');
        textarea.value = copyText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        console.log('copied');
        const copyItem = document.querySelector('.card-number__card-number');
        copyItem.classList.add('coppied');
        setTimeout(() => copyItem.classList.remove('coppied'), 10000);
    }

    const copyButton = document.querySelector('.card-number__copy-button');
    copyButton.addEventListener('click', copyToClipboard);

    //DOMContentLoaded brackets
});
