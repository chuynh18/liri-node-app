require("dotenv").config();
var fs = require("fs");
var Twitter = require('twitter');
var keys = require("./keys.js");
var arg = process.argv[2];

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var getTweets = function() {
    var twitterUserName = process.argv[3];
    var params = {screen_name: twitterUserName, count: 20};
    if (process.argv[3] === "--help") {
        console.log("get-tweets [<username>]        retrieves last 20 tweets from the specified Twitter username and displays them");
        console.log("get-tweets [<username>] save   retrieves last 20 tweets from the specified Twitter username, displays them, and saves the raw JSON response to twitter.txt");
    }
    else {
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
            
                console.log("Retrieving last 20 tweets from Twitter user " + twitterUserName + "...");
                console.log("");

                for (var i = 0; i < JSON.parse(response.body).length; i++) {
                    console.log("Tweet #" + (i+1));
                    console.log("Tweeted on: " + JSON.parse(response.body)[i].created_at);
                    console.log(JSON.parse(response.body)[i].text);
                    console.log("------------------------------");
                };

                if (process.argv[4] === "save") {
                    fs.writeFile("twitter.txt", JSON.stringify(JSON.parse(response.body),null,'\t'), function(err) {
                        // If the code experiences any errors it will log the error to the console.
                        if (err) {
                            return console.log(err);
                        }
                    });
                };
            };
        });
    };
};

switch(arg) {

    case "get-tweets":
    getTweets();
    break;

    // I personally never RTFM, so what better way to make me RTFM than to print out the manual itself?
    default:
    console.log("liri.js: Invalid command or argument, or no command was specified.")
    console.log("");
    console.log("Usage: node liri.js <command> [<args>]");
    console.log("");
    console.log("liri.js has several commands, which each require different arguments.");
    console.log("");
    console.log("get-tweets [<username>]   retrieves last 20 tweets from the specified Twitter username and displays them");
    console.log("");
    console.log("Type 'node liri.js <command> --help' for additional information about specific commands.");

};