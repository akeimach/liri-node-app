var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var twitter = require("twitter");
var spotify = require("node-spotify-api");

var command = process.argv[2];
var input = process.argv.slice(3).join(" "); // everything after the initial command

runProgram();

function runProgram() {
    switch(command) {
        case "my-tweets":
            displayTweets();
            break;
        case "spotify-this-song":
            displaySong();
            break;
        case "movie-this":
            displayMovie();
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("invalid command");
    }
}


function displayTweets() {

    var client = new twitter({
          consumer_key: keys.twitterKeys.consumer_key,
          consumer_secret: keys.twitterKeys.consumer_secret,
          access_token_key: keys.twitterKeys.access_token_key,
          access_token_secret: keys.twitterKeys.access_token_secret
    });
 
    var params = {
        screen_name: "yaboybillnye",
        count: 20
    };

    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error && response.statusCode === 200) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at + "\n" + tweets[i].text + "\n\n");
            }
        }
    });
}

function displaySong() {

    var client = new spotify({
        id: keys.spotifyKeys.client_id,
        secret: keys.spotifyKeys.client_secret
    });

    if (!input) {
        input = "The Sign";
    }

    var params = {
        type: "track",
        query: input
    }
 
    client.search(params, function(error, data) {
        if (!error) {
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
            console.log("Song: " + data.tracks.items[0].name); 
            console.log("Preview: " + data.tracks.items[0].preview_url); 
            console.log("Album: " + data.tracks.items[0].album.name);
        }
    });
}


function displayMovie() {

    if (!input) {
        input = "Mr. Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=" + keys.omdbKeys.api_key;

    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
        else {
            console.log("failed");
        }
    })
}


function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (!error) {
            dataArr = data.split(",");
            command = dataArr[0];
            if (dataArr.length > 1) {
                input = dataArr[1].replace(/"/g, "");
            }
            if (command === "do-what-it-says") {
                return console.log("Infinite loop, exiting before it's too late");
            }
            runProgram();
        }
    });
}

