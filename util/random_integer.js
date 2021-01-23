const randomInt = require('random-int');

// Force random integer - Warning: both limits are taken into account!
let forceRandomInteger = function (limInf, limSup){

    randomNumber = undefined

    while (randomNumber === undefined){
        randomNumber = randomInt(limInf, limSup);
    }

    console.log("Random number: " + randomNumber)
    return randomNumber
}

module.exports = {forceRandomInteger};