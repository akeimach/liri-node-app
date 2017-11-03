var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var twitter = require("twitter");
var spotify = require("node-spotify-api");

var command = process.argv[2];
var input = process.argv.slice(3).join(" "); // everything after the initial command

runProgram();


function runProgram() {
    logText("\n\nYour command input: " + command + " " + input);
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
            logText("invalid command");
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
                logText(tweets[i].created_at + "\n" + tweets[i].text);
            }
        }
        else {
            logText("Failed at my-tweets " + error);
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
            logText("Artist: " + data.tracks.items[0].album.artists[0].name); 
            logText("Song: " + data.tracks.items[0].name); 
            logText("Preview: " + data.tracks.items[0].preview_url); 
            logText("Album: " + data.tracks.items[0].album.name);
        }
        else {
            logText("Failed at spotify-this-song " + error);
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
            var bodyObj = JSON.parse(body);  // convert from string to object
            logText("Title: " + bodyObj.Title);
            logText("Year: " + bodyObj.Year);
            logText("IMDB Rating: " + bodyObj.imdbRating);
            logText("Rotten Tomatoes Rating: " + bodyObj.Ratings[1].Value);
            logText("Country: " + bodyObj.Country);
            logText("Language: " + bodyObj.Language);
            logText("Plot: " + bodyObj.Plot);
            logText("Actors: " + bodyObj.Actors);
        }
        else {
            logText("Failed at movie-this " + error);
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
                return logText("Infinite loop, exiting before it's too late");
            }
            runProgram();
        }
        else {
            logText("Failed at do-what-it-says " + error);
        }
    });
}


function logText(content) {
    console.log(content + "\n");
    fs.appendFile("log.txt", content + "\n\n", function(error) {
        if (error) {
            console.log("Failed save to log file");
        }
    });
}
