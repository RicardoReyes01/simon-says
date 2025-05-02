// Game variables that are set at the start of the code
let strictMode = false;
let gameActive = false;
const sequence = [];      // Stores  color pattern used in game
let userSequence = [];    // Stores user input sequence
let level = 1;
let isPlayingSequence = false;
const buttonSound = new Audio('content/ding.wav');
const levelCount = document.querySelector('.level-count');

//Initalizes the game
function startGame() {
	console.log("startGame called");
	if (gameActive) return;

	gameActive = true;
	sequence.length = 0;
	userSequence.length = 0;
	level = 1;
	levelCount.textContent = level;

	nextRound();
	if (strictMode) {
		document.getElementById("start-btn").disabled = false;  // allow retry in strict
		document.getElementById("reset-btn").disabled = true;   // disable reset in strict
	} else {
		document.getElementById("start-btn").disabled = true;   // disable start in regular
		document.getElementById("reset-btn").disabled = false;  // enable reset in regular
	}
}


//gameloop that starts the next level
function nextRound() {
	addToSequence();     
	playSequence();      
}

//Function used to generate color for sequence and add it to the list.
function addToSequence() {
	const randomColor = Math.floor(Math.random() * 4) + 1;
	sequence.push(randomColor);
}

//plays the sequence
function playSequence() {
	isPlayingSequence = true;
	disableButtons();  //This is used here to make sure the player doesnt give any input while the sequence is playing

	let i = 0;
	const intervalId = setInterval(() => {
		highlightButton(sequence[i]);
		i++;
		if (i >= sequence.length) {
			clearInterval(intervalId);
			setTimeout(() => {
				enableButtons();  //this allows the user to input again after the sequence.
			}, 500);
		}
	}, 1000);
}

//Takes the user's inputs
function handleClick(button) {
	if (gameActive) {
		const userColor = button.getAttribute("data-color");
		userSequence.push(Number(userColor));

		if (!checkSequence()) {
			disableButtons();  //Disables input after mistake

			if (strictMode) {
				//Restarts the game if it's on strict move
				alert(`Game over! Press Start to retry from level 1.\nFINAL SCORE: ${level}`);
				addScoreToBoard(level);
				level = 1;
				userSequence = [];
				sequence.length = 0;
				level = 1;
				levelCount.textContent = "-";
				gameActive = false;
				disableButtons();
				document.getElementById("power-btn").textContent = "Start";
				document.getElementById("power-btn").disabled = false;			
			} else {
				//replays the same level if strict mode is not on
				alert(`Wrong! Pay attention and try again!`);
				userSequence = [];
				addScoreToBoard(level);
				setTimeout(() => {
					playSequence();
				}, 1000);
			}
			return;
		} else if (userSequence.length === sequence.length) {
			//if user gets sequence right they move on to the next level.  
			userSequence = [];
			level++;
			levelCount.textContent = level;

			if (level <= 20) {
				setTimeout(() => nextRound(), 1000);
			} else {
				alert("Congratulations! You won!");
				startGame();
			}
		}
		highlightButton(userColor);
	}
}

//Compares user input to game sequence.
function checkSequence() {
	for (let i = 0; i < userSequence.length; i++) {
		if (userSequence[i] !== sequence[i]) {
			return false;
		}
	}
	return true;
}

//Flashes the button when the sequence is shown
function highlightButton(color) {
	const button = document.querySelector(`[data-color="${color}"]`);

	if (isPlayingSequence) {
		const ding = new Audio('content/ding.wav');
		ding.play();
	}

	if (Number(color) == 1) {
		button.style.backgroundColor = 'lightgreen';
	}
	else if (Number(color) == 2) {
		button.style.backgroundColor = 'tomato';
	}
	else if (Number(color) == 3) {
		button.style.backgroundColor = 'yellow';
	}
	else if (Number(color) == 4) {
		button.style.backgroundColor = 'lightskyblue';
	}
	setTimeout(() => {
		button.attributes.removeNamedItem('style');
	}, 300);
}

//Function used to enable buttons.
function enableButtons() {
	const buttons = document.querySelectorAll('.simon-btn');
	buttons.forEach(button => button.removeAttribute('disabled'));
}

//Function used to disable buttons
function disableButtons() {
	const buttons = document.querySelectorAll('.simon-btn');
	buttons.forEach(button => button.setAttribute('disabled', 'true'));
}

//toggles strict modew
function toggleStrictMode() {
	if (gameActive) {
		alert("Refresh page to switch modes.");

		// Reset checkbox to its original state
		const checkbox = document.getElementById("strict-mode");
		checkbox.checked = strictMode; // revert to the last value
		if (strictMode == false) {
			playSequence()
		}
		return;
	}
	strictMode = !strictMode;
}

//adds score to Scoreboard
function addScoreToBoard(level) {
	const scoreList = document.getElementById('score-list');
	const li = document.createElement('li');
	const scoreNumber = scoreList.children.length + 1;
	li.textContent = `SCORE: ${scoreNumber} : ${level * 1000}`;
	scoreList.appendChild(li);
  }

//reset functionality for 
function resetGame() {
	if (!gameActive || strictMode) return;

	sequence.length = 0;
	userSequence.length = 0;
	level = 1;
	levelCount.textContent = level;
	nextRound();
	document.getElementById("start-btn").disabled = true;
}

  

  
