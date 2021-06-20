
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
]

let timer, timeRemaining, lives, selectedNum, selectedTile;
let disableSelect;

window.onload = function () {
    id("theme-1").addEventListener("click", setTheme);
    // Run startGame 
    id("start-btn").addEventListener("click", startGame);
    // Add event listener to each number in number container
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function () {
            //If selecting is not disabled
            if (!disableSelect) {
                // If number is already selected
                if (this.classList.contains("selected")) {
                    // Then remove selection
                    this.classList.remove("selected");
                    selectedNum = null;
                }
                else {
                    // Deselect all others numbers
                    for (let i = 0; i < id("number-container").children.length; i++) {
                        id("number-container").children[i].classList.remove("selected");
                    }
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();

                }
            }
        })
    }
}

function startGame() {
    // Choose board difficulty
    let board;
    if (id("diff-1").selected) board = easy[0];
    else if (id("diff-2").selected) board = medium[0];
    else board = hard[0];

    //Set Lives to 3 and enable selecting numbers and tiles
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining: " + lives;

    //Creates Board based on difficulty
    generateBoard(board);
    //Starts the timer
    startTimer();

    //Show number container
    id("number-container").classList.remove("hidden");
}
function setTheme(){
        //Sets theme based on input
    if (id("theme-1").checked) {
        qs("body").classList.remove("dark");
    }
    else {
        qs("body").classList.add("dark");
    }
}
function startTimer() {
    //Sets time remaining based on input
    if (id("time-1").selected) timeRemaining = 180;
    else if (id("time-2").selected) timeRemaining = 300;
    else timeRemaining = 600;
    //Sets timer for first second
    id("timer").textContent = timeConversion(timeRemaining);
    //Sets timer to update every second
    timer = setInterval(function () {
        timeRemaining--;
        //If no time remaining end the game
        if (timeRemaining === 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000)
}

//Converts second into strinf of MM:SS format
function timeConversion(time) {
    let minutes = Math.floor(time / 60);
    if (minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function generateBoard(board) {
    //Clear previous board
    clearPrevious();
    //Let used to increment tile ids
    let idCount = 0;
    //Create 81 tiles
    for (let i = 0; i < 81; i++) {
        //Create a new paragraph element
        let tile = document.createElement("p");
        //If the tile is not supposed to be blank
        if (board.charAt(i) != "-") {
            tile.textContent = board.charAt(i);
        }
        else {
            //Add click event listener to tile
            tile.addEventListener("click", function () {
                //If selecting is not disabaled 
                if (!disableSelect) {
                    if (tile.classList.contains("selected")) {
                        //Then remove selection
                        tile.classList.remove("selected")
                        selectedTile = null;
                    }
                    else {
                        //Deselect all others tiles
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        //Add selection and update variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            })
        }
        //Assign tile id
        tile.id = idCount
        //Increment for next tile 
        idCount++;
        //Add tile class to all tiles
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        //Add tile to board
        id("board").appendChild(tile);
    }
}

function updateMove() {
    // If a tile and a number is selected
    if (selectedTile && selectedNum) {
        // Set the tile to correct 
        selectedTile.textContent = selectedNum.textContent;
        //If the number matches the corresponding number in the solution key
        if (checkCorrect(selectedTile)) {
            // Deslect the tiles
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //Clear the selected variables
            selectedNum = null;
            selectedTile = null;
            //Check if board is completed
            if (checkDone()) {
                endGame();
            }
            // If the number doees not match the solution key 
        }
        else {
            //Disable selecting new numbers for one second
            disableSelect = true;
            //Make the tile turn red
            selectedTile.classList.add("incorrect");
            //Run in one second
            setTimeout(function () {
                //Subtract lives by one
                lives--;
                //If no lives left end the game
                if (lives === 0) {
                    endGame();
                }
                else {
                    //If lives is not equal to zero
                    //Update lives text
                    id("lives").textContent = "Lives Remaining: " + lives;
                    //Renable selecting numbers and tiles
                    disableSelect = false;
                }
                //Restore tile color and remove selected from both
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                //Clear the tiles text and clear selected variables
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;
            }, 1000)
        }
    }
}

function checkDone() {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent === "") return false;
    }
    return true;
}

function endGame() {
    //Disable moves and stop timer
    disableSelect = true;
    clearTimeout(timer);
    //Display win or loss message
    if (lives === 0 || timeRemaining === 0) {
        id("lives").textContent = "You Lost!";
    }
    else {
        id("lives").textContent = "You Won!";
    }
}

function checkCorrect(tile) {
    // Set solution based on difficulty selection
    let solution;
    if (id("diff-1").selected) solution = easy[1];
    else if (id("diff-2").selected) solution = medium[1];
    else solution = hard[1];
    // If tiles number is equal to solution's number
    if (solution.charAt(tile.id) === tile.textContent) return true;
    else return false;
}

function clearPrevious() {
    //Access all of the tiles
    let tiles = qsa(".tile");
    //Remove each tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    //If there is a timer clear it
    if (timer) clearTimeout(timer);
    //Deslect any numbers
    for (let i = 0; i < id('number-container').children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }
    selectedNum = null;
    selectedTile = null;
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}

function id(id) {
    return document.getElementById(id);
}