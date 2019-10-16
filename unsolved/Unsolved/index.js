const inquirer = require("inquirer");
const fs = require('fs');
const genHTML = require("./generateHTML");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);




const questions =
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is your github profile?"
        },
        {
            type: "list",
            message: "Choose a background color",
            name: "color",
            choices: [
                "green",
                "blue",
                "pink",
                "red"
            ]
        }
    ]).then(function (answers) {
        var filename = answers.name.toLowerCase().split(' ').join('') + ".html";

        const queryUrl = `https://api.github.com/users/${answers.name}/repos?per_page=100`;

        axios.get(queryUrl).then(function (repos) {
            axios.get(`https://api.github.com/users/${answers.name}`).then(function(profile){
                console.log(profile.data);
                const bio = profile.data.bio;
                console.log(profile.data.name);
                const followers = profile.data.followers;
                const following = profile.data.following;
                const repositories = repos.data.length;
                const avatar = repos.data[0].owner.avatar_url;
                const starCount = repos.data.reduce(starCounter,0);
                console.log(starCount);
                const html = genHTML(answers, starCount, repositories, avatar, followers, following, bio);
                writeToFile(filename, html);
            });
            
        });


    }).catch(function (err) {
        console.log(err);
    });

function writeToFile(fileName, data) {
    return writeFileAsync(fileName, data);
}

function starCounter(totalStars, repo){
   return totalStars + repo.stargazers_count;
}

function init() {
}
init();
