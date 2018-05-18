require("dotenv").config();
var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var arg = process.argv[2];

var twitterApi = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var spotifyApi = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET,
  });

var getTweets = function() {
    var twitterUserName = process.argv[3];
    var params = {screen_name: twitterUserName, count: 20};
    if (process.argv[3] === "--help") {
        console.log("get-tweets [<username>]        retrieves last 20 tweets from the specified Twitter username and displays them");
        console.log("get-tweets [<username>] save   retrieves last 20 tweets from the specified Twitter username, displays them, and saves the raw JSON response to twitter.txt");
    }
    else {
        twitterApi.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
            
                console.log("Retrieving last 20 tweets from Twitter user " + JSON.parse(response.body)[0].user.screen_name + "...");
                console.log("");

                for (var i = 0; i < JSON.parse(response.body).length; i++) {
                    console.log("Tweet #" + (i+1) + " by " + JSON.parse(response.body)[i].user.name + " (" + JSON.parse(response.body)[i].user.screen_name + ")");
                    console.log("Tweeted on: " + JSON.parse(response.body)[i].created_at);
                    console.log(JSON.parse(response.body)[i].text);
                    console.log("------------------------------------------------------------");
                };

                if (process.argv[4] === "save") {
                    fs.writeFile("twitter.txt", JSON.stringify(JSON.parse(response.body),null,'\t'), function(err) {
                        // If the code experiences any errors it will log the error to the console.
                        if (err) {
                            return console.log(err);
                        };
                    });
                };
            };
        });
    };
};

var getSpotify = function() {
    if (process.argv[3] === "--help") {
        console.log("spotify-this-song [<song>]        searches Spotify and returns basic information about the specified song");
        console.log("spotify-this-song [<song>] save   searches Spotify and returns basic information about the specified song, and saves the raw JSON response to spotify.txt");
    }
    else {
        var query = process.argv[3];
        if (query === undefined) {
            query = "Ace of Base The Sign";
        };
        spotifyApi
        .request('https://api.spotify.com/v1/search?q=' + query + "&type=track")
        .then(function(data) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                console.log("Result #" + (i+1) + "...");
                var artists = "";
                for (var j = 0; j < data.tracks.items[i].artists.length; j++) {
                    artists += data.tracks.items[i].artists[j].name + ", ";
                };
                artists = artists.slice(0,(artists.length-2));
                console.log("Artist(s): " + artists);
                console.log("Track name: " + data.tracks.items[i].name);
                if (data.tracks.items[i].preview_url != null) {
                    console.log("Preview link: " + data.tracks.items[i].preview_url);
                }
                else {
                    console.log("Sorry, no preview URL available.");
                };
                console.log("Album: " + data.tracks.items[i].album.name);
                console.log("------------------------------------------------------------");
            };
            if (process.argv[4] === "save") {
                fs.writeFile("spotify.txt", JSON.stringify(data, null, '\t'), function(err) {
                    // If the code experiences any errors it will log the error to the console.
                    if (err) {
                        return console.log(err);
                    };
                });
            };
        })
        .catch(function(err) {
            console.error('Error occurred: ' + err); 
        });
    };
};

var educateUser = function() {
    console.log("liri.js: Invalid command or argument, or no command was specified.")
    console.log("");
    console.log("Usage: node liri.js <command> [<args>]");
    console.log("");
    console.log("liri.js has several commands, which each require different arguments.");
    console.log("");
    console.log("get-tweets [<username>]      retrieves last 20 tweets from the specified Twitter username and displays them");
    console.log("my-tweets                    gently nudges the user into using 'get-tweets' instead");
    console.log("spotify-this-song [<song>]   searches Spotify and returns basic information about the specified song");
    console.log("");
    console.log("Type 'node liri.js <command> --help' for additional information about specific commands.");
};

switch(arg) {

    case "get-tweets":
    getTweets();
    break;

    case "my-tweets":
    console.log("No.  I don't use social media.  But for the purposes of this homework assignment, please use 'node liri.js get-tweets [<username>]'");
    break;

    case "spotify-this-song":
    getSpotify();
    break;

    // I personally never RTFM, so what better way to make me RTFM than to print out the manual itself?
    default:
    educateUser();
    break;
};