const express = require('express');
const router = express.Router();
const axios = require('axios');

// Util
let setDifference = require('/util/set_operations').setDifference
let arrayToJson = require('/util/array_to_json').arrayToJson
let repo_api = require('/util/urls').repo_api

// Database model
const Verb = require('/models/verb');

let get_set_of_images_in_repository = async function () {

    let repo_api_response = await axios.get(repo_api + '/verbs')

    // Create a set from the images on the Github Repo
    let github_repo_set = new Set(repo_api_response.data.map((entry) => entry.download_url))
    console.log("Number of images in Github Repo: " + github_repo_set.size)

    return github_repo_set
}

let get_set_of_images_in_database = async function () {

    let verbs = await Verb.find({}, {'_id': false, 'imageURL': true}).sort({nameUTF8: 1})

    // Create a set from the images on the Database
    let database_verbs_set = new Set(verbs.map((verb) => verb.imageURL))
    console.log("Number of images in Database: " + database_verbs_set.size)

    return database_verbs_set
}

let get_verbs_todo_json = async function () {

    let github_repo_set = await get_set_of_images_in_repository()
    let database_verbs_set = await get_set_of_images_in_database()

    // Calculate difference between githubRepoSet and dbVerbsSet
    let verbs_todo_set = setDifference(github_repo_set, database_verbs_set)
    let verbs_todo_array = Array.from(verbs_todo_set)
    console.log("Difference: " + verbs_todo_array)

    return arrayToJson(verbs_todo_array)
}

// GET /todo  - Get list of verbs left to add to database
router.get('/', function (req, res) {

    get_verbs_todo_json()
        .then(verbs_todo_json => {

            return res.status(200).json(verbs_todo_json)
        })
        .catch(err => {

            console.log(err)
            return res.render('404')
        })
})

module.exports = router;