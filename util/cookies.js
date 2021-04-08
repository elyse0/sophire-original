const cookieParser = require('cookie-parser')

let print_cookies = function (cookies){
    console.log("*******************************")
    console.log("Cookie: ")
    console.log(cookieParser.JSONCookies(cookies))
}

let get_verbsID_from_cookie = function (cookies){

    let verbsID

    try{
        verbsID = cookieParser.JSONCookies(cookies)['FrenchVerbs'].verbsID
    }catch (e){
        verbsID = undefined
    }

    return verbsID
}

let get_vocabularyID_from_cookie = function (cookies){

    let vocabularyID

    try{
        vocabularyID = cookieParser.JSONCookies(cookies)['FrenchVerbs'].vocabularyID
    }catch (e){
        vocabularyID = undefined
    }

    return vocabularyID
}

module.exports = {get_verbsID_from_cookie, get_vocabularyID_from_cookie, print_cookies};