let highNumbers = [25, 50, 75, 100]
let lowNumbers = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]
let numbers = []
let round = 1
let numbersToPick = 2
let timeLeft = 6000
let calculation = []
const operators = ['+','-','*','/','(',')']
const clickableOnce = document.querySelectorAll('.movable')
const clickableStationary = document.querySelectorAll('.fixed')
// The numbers and operations you chose are displayed
const chosen = document.getElementById('chosen')
// Where the numbers youve been given and the base operations are
const numbHolder = document.getElementById('numbers')
// Display the closest someone has got to the answer
const closest = document.getElementById('closest')
let bestAnswer = 0
let finalScore = document.getElementById('score')
let usersAndHighscores = document.getElementById('highscores')


// fetch 
const getUsers = () => { 
    return fetch ("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(users => renderCurrentUsers(users))
}

const renderCurrentUsers = users => {
    users.forEach(user => renderUser(user))
}

const renderUser = user => {
    pTag = document.createElement('p')
    pTag.innerText = `${user.name} : ${user.score}`
    usersAndHighscores.append(pTag)
}

const addHighButtonFunctionality = () => {
    highBtn = document.getElementById('high')
    highBtn.addEventListener('click', () => {
        if (numbersToPick > 1) {
            pickHigh()
            numbersLeftToPick()
            fillDomNumbers()
        } else {
            pickHigh()
            startRound()
        }
    })
}

const addLowButtonFunctionality = () => {
    lowBtn = document.getElementById('low')
    lowBtn.addEventListener('click', () => {
        if (numbersToPick > 1) {
            pickLow()
            numbersLeftToPick()
            fillDomNumbers()
        } else {
            pickLow()
            startRound()
        }
    })
}

const startRound = () => {
    numbersLeftToPick()
    fillDomNumbers()
    highBtn.remove()
    lowBtn.remove()
    document.getElementById('toPick').remove()
    displayGoalAndTimer()
    startListeners()
}

const numbersLeftToPick = () => {
    pickLeft = document.getElementById('toPick')
    pickLeft.innerText = `Pick ${numbersToPick} more numbers to start`
} 

// Generate a random number between 101 and 999 
const targetNumber = () => Math.floor(Math.random() * 898) + 101 

// When high number is picked remove it from its array and place it in general numbers array
const pickHigh = () => {
    if (highNumbers.length > 0) {
        let chosen = Math.floor(Math.random() * highNumbers.length)
        numbers.push(highNumbers[chosen])
        highNumbers.splice(chosen, 1)
        numbersToPick--
        if (highNumbers.length === 0) {
            console.log("here")
            highBtn.disabled = true
            highBtn.innerText = 'No more left'
            
        }
    }
}

// When low number is picked remove it from its array and place it in general numbers array
const pickLow = () => {
    let chosen = Math.floor(Math.random() * lowNumbers.length)
    numbers.push(lowNumbers[chosen])
    lowNumbers.splice(chosen, 1)
    numbersToPick--
}

// Only start listening to buttons once they are all filled
const startListeners = () => {
    addListenerToNumbers()
    addListenerToOperants()
    addListenToUndoBtn()
}

const pushAndEvaluate = btn => {
    calculation.push(btn.innerText)
        fillDomNumbers()
        renderCurrentCalculation()
        evaluate()
        evaluateClosest()
}

const btnClickHandler = (btn, btnType) => {
    if (calculation.length > 0) {
        if (!isNaN(Number(calculation.slice(-1)))) {
            if (operators.includes(btn.innerText)) {
                pushAndEvaluate(btn)
            }
        } else {
            pushAndEvaluate(btn)
        }
    } else {
        pushAndEvaluate(btn)
    }
}

// Attach listeners to numberss so they can be moved to calculation array
const addListenerToNumbers = () => {
    numbBtns = document.getElementsByClassName('movable')
    for (let btn of numbBtns) {
        btn.addEventListener('click', () => btnClickHandler(btn, 'number'))
    }
}

// Attach listeners to operants so they can be moved to calculation array
const addListenerToOperants = () => {
    operantBtns = document.getElementsByClassName('fixed')
    for (let btn of operantBtns) {
        btn.addEventListener('click', () => btnClickHandler(btn, 'operants'))
    }
}

// Evaluate and display the closest number the user has got to the target
const evaluateClosest = () => {
    let diff = Math.abs(goal - bestAnswer)
    if (Math.abs(goal - yourAnswer) < diff) {
        bestAnswer = yourAnswer
    }
    closest.innerText = `The closest you have got is ${bestAnswer}`
}

// Start a decreasing timer, updates the DOM and stops at 0
const timer = () => {
    let timer = document.getElementById('time')
    const timeDown = () => {
        if (timeLeft != 0) {
            timeLeft--
            timer.innerHTML = `${timeLeft} seconds left`
        } else {
            clearInterval()
            timer.innerHTML = `Times up`
            gameOver()
        }
    }
    setInterval(timeDown, 1000)
}

const gameOver = () => {
    for (let btn of numbBtns) (btn.disabled = true)
    for (let btn of operantBtns) (btn.disabled = true)
    calculateAndDisplayScore()
}

// Update the DOM with randomly generated target number
const displayTargetNumber = () => {
    goal = targetNumber()
    target.innerHTML = `Your target number is ${goal}`
}

// Populate the DOM with numbers allocated
const fillDomNumbers = () => {
    for ( let i = 0; i < numbers.length; i++ ) {
        numbHolder.children[i].innerHTML = numbers[i]
    }
}

// Evaluate what has been entered into the calculation
const evaluate = () => {
        let sum = ""
        for (let i = 0; i < calculation.length; i++) {
        sum += calculation[i]
        }
            yourAnswer = eval(sum);
            if (typeof(yourAnswer) === "number") {
                if (yourAnswer % 1 === 0) {
                    return ( `= ${yourAnswer}` )
                } else {
                    return ' Answer must be a whole number '
                }
            } else {
                return ' '
            }
}

// Render the current calculation on the page and its answer
const renderCurrentCalculation = () => {
    chosen.innerHTML = ""

    calculation.forEach( calc => {
        const newDiv = document.createElement('div')
        newDiv.innerText = calc
        chosen.append(newDiv)
    })

    const finalDiv = document.createElement('div')
    finalDiv.innerText = evaluate()

    chosen.append(finalDiv)
}

// Only display a target and start the timer once all numbers have been picked
const displayGoalAndTimer = () => {
    if (numbersToPick === 0) {
        displayTargetNumber()
        timer()
    }
}

const addListenToUndoBtn = () => {
    undoBtn = document.getElementById('undo')
    undoBtn.addEventListener('click', () => {
        calculation.pop()
        renderCurrentCalculation()
    })
}

const calculateAndDisplayScore = () => {
    range = Math.abs(goal - bestAnswer)
    let score = 0
    if (range === 0) {
        score = 10
    } else if (range <= 2) {
        score = 8
    } else if (range <= 5) {
        score = 6
    } else if (range <= 10) {
        score = 4
    } else if (range <= 20) {
        score = 2
    } 
    finalScore.innerText = `Your final score is ${score}`
}

const init = () => {
    getUsers()
    fillDomNumbers()
    evaluate()
    renderCurrentCalculation()
    numbersLeftToPick()
    addHighButtonFunctionality()
    addLowButtonFunctionality()
}


init()

// 1. How to get it so user cant concatinate numbers
// 2. Sort out screen changes
// 3. How to get rounds working
// 4. Get eval to not break when it isnt a legitimate sum // check if end is not okay

