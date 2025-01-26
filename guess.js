//Getting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Bahaa Hamdy`;


//Create Game Area
let numbersOfTries = 5;
let numbersOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

//Manage Words
let wordToGuess = "";
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
// console.log(wordToGuess);

let messageArea = document.querySelector(".message");

//Manage Hints
document.querySelector(".hints span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hints");
getHintButton.addEventListener("click", getHint);


function generateInputs() {
    const inputsConstainer = document.querySelector(".inputs");

    //Create Main Try Dev
    for (let i = 1; i <= numbersOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if (i !== 1) {
            tryDiv.classList.add("disabled-inputs");
        }
        //Create Inputs
        for (let j = 1; j <= numbersOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);
        }
        inputsConstainer.appendChild(tryDiv); 
    }
    //Focus on First Input In First Try Element
    inputsConstainer.children[0].children[1].focus();

    // Disabled All Inputs In First Try Element
    const inputInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputInDisabledDiv.forEach(input => { input.disabled = true });

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        //Convert Input To Uppercase
        input.addEventListener("input", function() {
            this.value = this.value.toUpperCase();
            // console.log(index);
            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
        })

        input.addEventListener("keydown" , function (event) {
            // console.log(event);
            const currentIndex = Array.from(inputs).indexOf(event.target); //event.target or this
            // console.log(Array.from(inputs));
            if (event.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if (nextInput <= inputs.length) {
                    inputs[nextInput].focus();
                }
            }
            if (event.key === "ArrowLeft") {
                const prevInput = currentIndex - 1;
                if (prevInput >= 0) {
                    inputs[prevInput].focus();
                }
            }
        })
    });  
}

//Handle Guesses
const guessButton = document.querySelector(".check");
guessButton.addEventListener("click" , handleGuesses)


function handleGuesses(){
    let sucessGuess = true;
    for (let i = 1; i <= numbersOfLetters; i++){
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];
        

        //Game Logic
        if (letter === actualLetter) {
            inputField.classList.add("yes-in-place");
        } else if (wordToGuess.includes(letter) && letter !== "" ){
            inputField.classList.add("not-in-place");
            sucessGuess = false;
        } else {
            inputField.classList.add("no");
            sucessGuess = false;
        }
    }

    //Check If User Win Or Lose
    if (sucessGuess) {
        messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
        if (numberOfHints === 2) {
            messageArea.innerHTML = `<p>Congratz You Didn't Use Hints</p>`;

        }

        //Add Disabled Class On All Try Divs
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

        //Disable Guess Button
        guessButton.disabled = true;
        getHintButton.disabled = true;
        
    } else {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => (input.disabled = true));

        currentTry++;

        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => (input.disabled = false));

        let elem = document.querySelector(`.try-${currentTry}`);
        if (elem) {
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            elem.children[1].focus();
        } else {
            guessButton.disabled = true;
            getHintButton.disabled = true;
            messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`
        }
        

    }
}

function getHint() {
    const enableInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enableInputs).filter((input) => input.value === "");

    
    if (numberOfHints > 0 && emptyEnabledInputs.length !== 0) {
        numberOfHints--;
        document.querySelector(".hints span").innerHTML = numberOfHints;

    }
    if (numberOfHints === 0) {
        getHintButton.disabled = true;
    }
    
    //We Use Them Above to check if there is not empty input fields and we use them below
    // const enableInputs = document.querySelectorAll("input:not([disabled])");
    // console.log(enableInputs);
    // const emptyEnabledInputs = Array.from(enableInputs).filter((input) => input.value === "");
    // console.log(emptyEnabledInputs);

    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enableInputs).indexOf(randomInput); //return -1 if there is no empty field
        // console.log(indexToFill);
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }

    }
}

document.addEventListener("keydown", handleBackspace);

function handleBackspace(event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        // console.log(currentIndex);
        if (currentIndex > 0) {
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            currentInput.value = "";
            prevInput.value = "";
            prevInput.focus();
        }
    }
}



window.onload = function () {
    generateInputs();
};



