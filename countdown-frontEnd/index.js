let highNumbers = [25, 50, 75, 100]
let lowNumbers = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]
let numbers = []
let used_numbers = []
let round = 1
let numbersToPick = 6 //5/6/7 for difficulty
let timeLeft = 3
let calculation = []
let operators = ['+','-','*','/','(',')']
const clickableOnce = document.querySelectorAll('.movable')
const clickableStationary = document.querySelectorAll('.fixed')
// The numbers and operations you chose are displayed
const chosen = document.getElementById('chosen')
// Where the numbers youve been given and the base operations are
const numbHolder = document.getElementById('numbers')
// Display the closest someone has got to the answer
const closest = document.getElementById('closest')
let bestAnswer = 0
const finalScore = document.getElementById('score')
const usersAndHighscores = document.getElementById('highscores')
const resetBtn = document.getElementById('reset')
let timerEl = document.getElementById('time')
let intervalId
let pickDisplay = document.getElementById('toPick')
let roundScore

const timeDown = () => {
    if (timeLeft !== 0) {
        timeLeft--
        timerEl.innerHTML = `${timeLeft} seconds left`
    } else {
        clearInterval(intervalId)
        timerEl.innerHTML = `Times up`
        gameOver()
    }
}

// Fetch the users from the server 
const getUsers = () => { 
    return fetch ("http://localhost:3000/users")
    .then(resp => resp.json())
}

// Plural function that sends each user from getUsers() to renderUser
const renderCurrentUsers = users => {
    users.forEach(user => renderUser(user))
}

// Singular function that creates a P tag, adds the users name and score to it and then appends it to the page
const renderUser = user => {
    pTag = document.createElement('p')
    pTag.innerText = `${user.name} : ${user.score}`
    usersAndHighscores.append(pTag)
}

// Logic for what to do when high button is clicked
const addHighButtonFunctionality = () => {
    highBtn = document.getElementById('high')
    highBtn.addEventListener('click', () => {
        if (numbersToPick > 1) {
            pickHigh()
            numbersLeftToPick()
            fillDomNumbers() // needed
        } else {
            pickHigh()
            startRound()
        }
    })
}

// Logic for what to do when low button is clicked
const addLowButtonFunctionality = () => {
    lowBtn = document.getElementById('low')
    lowBtn.addEventListener('click', () => {
        if (numbersToPick > 1) {
            pickLow()
            numbersLeftToPick()
            fillDomNumbers() // needed
        } else {
            pickLow()
            startRound()
        }
    })
}


// Once numbers to pick is 0, start the round will remove the low and high buttons
// Remove the 'pick x more numbers to start', display the target and start the timer,
// Will then start the listeners else someone could start playing before then 
const startRound = () => {
    numbersLeftToPick()
    fillDomNumbers() // needed
    highBtn.style.display = "none"
    lowBtn.style.display = "none"
    pickDisplay.style.display = "none"
    displayGoalAndTimer()
    startListeners()
}

// Display how many numbers there are left to pick
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
    addListenerToOperants()
    addListenToUndoBtn()
}

// Push number/operant to calculation array, show the calculation, evaluate its some and check if 
// Its better than the previous closest someone has got.
const pushAndEvaluate = btn => {
    calculation.push(btn.innerText)
    console.log('This has been called operatos push and eval')
        renderCurrentCalculation()
        evaluate()
        evaluateClosest()
}

// This function listens to the document for key press's
const addListenToEscapeKey = () => {
    document.addEventListener('keydown', resetIfEscape)
}

// This function will reset the game if the key pressed was escape
const resetIfEscape = () => {
    if (event.keyCode === 27) {
        gameReset()
    }
}

// Attach listeners to operants so they can be moved to calculation array
const addListenerToOperants = () => {
    operantBtns = document.getElementsByClassName('fixed')
    for (let btn of operantBtns) {
        btn.addEventListener('click', () => pushAndEvaluate(btn))
    }
}

// Evaluate and display the closest number the user has got to the target
const evaluateClosest = () => {
    let diff = Math.abs(goal - bestAnswer)
    if (Math.abs(goal - yourAnswer) < diff) {
        bestAnswer = yourAnswer
    }
    closest.innerText = `Best so far: ${bestAnswer}`
    // If its solved perfectly, end round
    if (bestAnswer === goal) {
        timeLeft = 1 
    }
}

// Start a decreasing timer, updates the DOM and stops at 0
const timer = () => {
    intervalId = setInterval(timeDown, 1000)
}

// Call a game over when the time is over (or optimal score reached) and run neccessary functions 
const gameOver = () => {

    Array.from(numbHolder.children).forEach(btn => {
        btn.disabled = true
    });
    for (let btn of operantBtns) (btn.disabled = true)

    calculateAndDisplayScore() // Returns a round score
    postScoreToServer(roundScore)
}

const postScoreToServer = score => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({user: 'guest', score: score})
    }
    return fetch("http://localhost:3000/users", options).then(resp => resp.json())
}

// Update the DOM with randomly generated target number
const displayTargetNumber = () => {
    goal = targetNumber()
    target.innerHTML = `Your target number is: ${goal}`
}

// Populate the DOM with numbers allocated
const fillDomNumbers = () => {
    numbHolder.innerHTML = ''
    for (const index in numbers) {
        const number = numbers[index]
        const numberBtn = document.createElement('button')
        numberBtn.innerText = number
        numberBtn.addEventListener('click', () => {
            if (calculation[calculation.length - 1] % 1 !== 0) { 
                numbers.splice(index, 1)
                used_numbers.push(number)
                fillDomNumbers()
                calculation.push(number)
                renderCurrentCalculation()
                evaluateClosest()
            }
        })
        numbHolder.append(numberBtn)
    }
}

const clearDomNumbers = () => {
    for ( let i = 0; i < clickableOnce.length; i++ ) {
        numbHolder.children[i].innerHTML = ' '
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

// Listen to the undo button, remove last element from array, and render calculation
const addListenToUndoBtn = () => {
    undoBtn = document.getElementById('undo')
    undoBtn.addEventListener('click', () => {
        if (calculation.length > 0) {
            if (calculation.slice(-1) % 1 === 0 ) {
                // If last element in array is a number
                console.log('got to here after undo button')
                numbers.push(used_numbers.pop())
                calculation.pop()
                fillDomNumbers()
                renderCurrentCalculation()
                evaluate()
            } else { // Last element is a operant
                calculation.pop()
                fillDomNumbers()
                renderCurrentCalculation()
                evaluate()
            }
        }
    })
}

// Calculate score based on players performance. To do: Find a cleaner way to do this
const calculateAndDisplayScore = () => {
    range = Math.abs(goal - bestAnswer)
    roundScore = 0
    if (range === 0) {
        roundScore = 10
    } else if (range <= 2) {
        roundScore = 8
    } else if (range <= 5) {
        roundScore = 6
    } else if (range <= 10) {
        roundScore = 4
    } else if (range <= 20) {
        roundScore = 2
    } 
    finalScore.innerText = `Your final score is ${roundScore}`
    return roundScore
}

const addListenerToResetBtn = () => {
    resetBtn.addEventListener('click', gameReset)
}

let gameReset = () => {   
        numbersToPick = 6
        numbers = []
        highNumbers = [25, 50, 75, 100]
        lowNumbers = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]
        calculation = []
        highBtn.disabled = false
        highBtn.innerText = 'Pick a high number'
        renderCurrentCalculation() //needed
        numbersLeftToPick()
        clearDomNumbers()
        clearInterval(intervalId)
        timeLeft = 30
        Array.from(numbHolder.children).forEach(btn => {
            btn.remove()
        });
        for (let btn of operantBtns) (btn.disabled = false)
        timerEl.innerText = '60 seconds left'
        pickDisplay.style.display = ""
        highBtn.style.display = ""
        lowBtn.style.display = ""
        target.innerText = "Your target number is:"
        closest.innerText = "Best so far:"
}

const init = () => {
    getUsers()
        .then(users => renderCurrentUsers(users))
    evaluate()
    renderCurrentCalculation()
    numbersLeftToPick()
    addHighButtonFunctionality()
    addLowButtonFunctionality()
    addListenerToResetBtn()
    addListenToEscapeKey()
}

init()

// 1. How to get it so user cant concatinate numbers - done
// 2. Sort out screen changes - work around
// 3. How to get rounds working 
// 4. Get eval to not break when it isnt a legitimate sum // check if end is not okay
// 4 - Technically doesnt break but does put an error in the console
// 5. Add some more score based on how quickly they beat the game, if target met. 


// Code thats probably doesnt need to be used again graveyard.
// Attach listeners to numbers so they can be moved to calculation array
// const addListenerToNumbers = () => {
//     numbBtns = document.getElementsByClassName('movable')
//     for (let btn of numbBtns) {
//         btn.addEventListener('click', () => btnClickHandler(btn, 'number'))
//     }
// }

// This takes in inputs from numb and operant listeners and evaluates it, its primary
// Purpose is to avoid concatination of numbers
// const btnClickHandler = (btn, btnType) => {
//     if (calculation.length > 0) { 
//         // Got to here if calculation array is populated
//         if (calculation.slice(-1) % 1 === 0) { 
//             // Got to here if the last element of an array is a number
//             if (operators.includes(btn.innerText)) {
//                 // Got to here if the last btn clicked was an operator
//                 console.log('Issue 1')
//                 pushAndEvaluate(btn)
//             } else {
//                 console.log('Can not concatinate')
//             }
//         } else { 
//             // Got to here if the last element in array is operator
//             pushAndEvaluate(btn)
//             console.log('Issue 2')
//         }
//     } else {
//         // Got to here because its the first thing in array (and a number because its broke) therefore fine 
//         pushAndEvaluate(btn)
//         console.log('Issue 3')
//     }
    
//     // btn.disabled = true
//     console.log("why arent operators getting here?")
// }