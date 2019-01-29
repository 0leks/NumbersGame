console.log("loaded script.js");

let textField = document.getElementById("textFieldID");
textField.value = "(6 digit guess + hint)";

let guesses = [];

function updateGuessList() {
    
    let guessList = document.getElementById("guessListID");
    if( guesses.length == 0 ) {
        guessList.textContent = "Zero guesses so far.";
        return;
    }
    let guessString = "Guesses: ";
    for( let g of guesses) {
        guessString += "" + g[0] + g[1] + g[2] + g[3] + ":" + g[4] + g[5] + ", ";
    }
    guessList.textContent = guessString;
}
function parseInput() {
    let input = textField.value;
    textField.value = "";
    console.log(input);

    console.log(input[0]);
    console.log(input.length);

    let guess = {};
    guess[0] = parseInt(input[0]);
    guess[1] = parseInt(input[1]);
    guess[2] = parseInt(input[2]);
    guess[3] = parseInt(input[3]);
    guess[4] = parseInt(input[4]);
    guess[5] = parseInt(input[5]);
    let numCorrect = parseInt(input[4]);
    let numCorrectSlot = parseInt(input[5]);
    
    console.log(numCorrect);
    console.log(numCorrectSlot);
    console.log(guess);

    guesses.push(guess)
    updateGuessList();

}
function clearGuesses() {
    guesses = [];
    updateGuessList();
    updatePossList("Possibilities: Endless");
}

function computePossibilities() {
    console.log("Started compute");
    let poss = [];
    let possString = "Possibilities: ";
    for( let a = 0; a <= 9; a++ ) {
        for( let b = 0; b <= 9; b++ ) {
            for( let c = 0; c <= 9; c++ ) {
                for( let d = 0; d <= 9; d++ ) {
                    if( a == b || a == c || a == d || b == c || b == d || c == d ) {
                        continue;
                    }
                    //console.log("iter=" + a + b + c + d);
                    let passes = true;
                    for( let guess of guesses) {
                        let numDigit = 0;
                        let numSlot = 0;
                        for( let i = 0; i < 4; i++ ) {
                            if( guess[i] == a ) {
                                numDigit++;
                                if( i == 0 ) {
                                    numSlot++;
                                }
                            }
                            if( guess[i] == b ) {
                                numDigit++;
                                if( i == 1 ) {
                                    numSlot++;
                                }
                            }
                            if( guess[i] == c ) {
                                numDigit++;
                                if( i == 2 ) {
                                    numSlot++;
                                }
                            }
                            if( guess[i] == d ) {
                                numDigit++;
                                if( i == 3 ) {
                                    numSlot++;
                                }
                            }
                        }
                        if( numDigit == guess[4] && numSlot == guess[5]) {
                            passes = true;
                        }
                        else {
                            passes = false;
                            break;
                        }
                    }
                    if( passes == true ) {
                        let s = "" + a + b + c + d;
                        poss.push(s);
                        console.log(s);
                        possString += s + ", ";
                    }
                }
            }
        }
    }
    console.log("finished compute");
    if( poss.length > 100 ) {
        updatePossList("There are " + poss.length + " possibilities.");
    }
    else {
        updatePossList(possString);
    }

    //possList.value = possString;
    //possList.setAttribute("text", possString);
    
}
function updatePossList(possString) {
    let possList = document.getElementById("possListID");
    possList.textContent = possString;
}

function enter() { // TODO add option to press keyboard enter for same effect.
    console.log("pressed enter");
    parseInput();
    computePossibilities();
}
