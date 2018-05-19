"use strict";

require("dotenv").config();
var request = require("request");
var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var userCommand = process.argv[2];
var fromRandom;

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

var getTweets = function(argument) {
    var params = {screen_name: process.argv[3], count: 20};
    if (argument) {
        params = {screen_name: argument, count: 20};
    };
    if (process.argv[3] === "--help") {
        console.log("");
        console.log("get-tweets [<username>]        retrieves last 20 tweets from the specified Twitter username and displays them");
        console.log("get-tweets [<username>] save   retrieves last 20 tweets from the specified Twitter username, displays them, and saves the raw JSON response to twitter.txt");
        console.log("");
    }
    else {
        twitterApi.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                var twitterResponse = JSON.parse(response.body);
    
                if (!twitterResponse[0]) {
                    console.log ("This user has not tweeted.  Please try searching for someone else!");
                }
                else {
                    console.log("Retrieving last 20 tweets from Twitter user " + twitterResponse[0].user.screen_name + "...");
                    console.log("");

                    for (var i = 0; i < twitterResponse.length; i++) {
                        console.log("Tweet #" + (i+1) + " by " + twitterResponse[i].user.name + " (" + twitterResponse[i].user.screen_name + ")");
                        console.log("Tweeted on: " + twitterResponse[i].created_at);
                        console.log(twitterResponse[i].text);
                        console.log("------------------------------------------------------------");
                    };

                    if (process.argv[4] === "save") {
                        fs.writeFile("twitter.txt", JSON.stringify(twitterResponse,null,'\t'), function(err) {
                            // If the code experiences any errors it will log the error to the console.
                            if (err) {
                                return console.log(err);
                            };
                        });
                    };
                };
            }
            else if (error) {
                console.log("Error code " + error[0].code + " has occurred: '" + error[0].message + "'");
            };
        });
    };
};

var myTweets = function() {
    if (process.argv[3] === "--help") {
        console.log("'YOU CANNOT BE SERIOUS!' -John McEnroe");
        console.log("my-tweets   gently nudges the user into using 'get-tweets' instead");
    }
    else {
        console.log("No.  I don't use social media.  But for the purposes of this homework assignment, please use 'node liri.js get-tweets [<username>]'");
    };
};

var getSpotify = function(argument) {
    if (process.argv[3] === "--help") {
        console.log("");
        console.log("spotify-this-song [<song>]        searches Spotify and returns basic information about the specified song");
        console.log("spotify-this-song [<song>] save   searches Spotify and returns basic information about the specified song, and saves the raw JSON response to spotify.txt");
        console.log("");
        console.log("if no song is specified, spotify-this-song defaults to 'The Sign' by Ace of Base");
    }
    else {
        var query = process.argv[3];
        if (!query && !argument) {
            query = "Ace of Base The Sign";
        }
        else if (argument) {
            query = argument;
        };
        spotifyApi
        .request('https://api.spotify.com/v1/search?q=' + query + "&type=track")
        .then(function(data) {
            var spotifyData = data.tracks;

            if (!spotifyData.total) {
                console.log("No results found.  Please revise your search and try again.");
            }
            else {
                for (var i = 0; i < spotifyData.items.length; i++) {
                    console.log("Result #" + (i+1) + "...");
                    var artists = "";
                    for (var j = 0; j < spotifyData.items[i].artists.length; j++) {
                        artists += spotifyData.items[i].artists[j].name + ", ";
                    };
                    artists = artists.slice(0,(artists.length-2)); // remove the trailing comma space (", ") coming from the for loop
                    console.log("Artist(s): " + artists);
                    console.log("Track name: " + spotifyData.items[i].name);
                    if (spotifyData.items[i].preview_url) {
                        console.log("Preview link: " + spotifyData.items[i].preview_url);
                    }
                    else {
                        console.log("Sorry, no preview URL available.");
                    };
                    console.log("Album: " + spotifyData.items[i].album.name);
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
            };
        })
        .catch(function(err) {
            console.error('Error occurred: ' + err); 
        });
    };
};

var movieSearch = function(argument) {
    var movie = process.argv[3];
    if (movie === "--help") {
        console.log("");
        console.log("movie-this [<movie>]        searches OMDb and returns basic information about the specified movie");
        console.log("movie-this [<movie>] save   searches OMDb and returns basic information about the specified movie and saves the raw JSON response to movie.txt");
        console.log("");
        console.log("if no movie is specified, movie-this defaults to 'Mr. Nobody'");
    }
    else {
        if (!movie && !argument) {
            movie = "Mr. Nobody";
        }
        else if (argument) {
            movie = argument;
        };
        request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {
                var omdbResponse = JSON.parse(body);
                if (omdbResponse.Response === "False") {
                    console.log("Sorry, movie not found.  Please revise your search and try again.  Note that OMDb search is very picky!")
                }
                else {
                    console.log("Movie title: " + omdbResponse.Title);
                    console.log("Year: " + omdbResponse.Year);
                    console.log(omdbResponse.Ratings[0].Source + " rating: " + omdbResponse.Ratings[0].Value);
                    console.log(omdbResponse.Ratings[1].Source + " rating: " + omdbResponse.Ratings[1].Value);
                    console.log("Country of origin: " + omdbResponse.Country);
                    console.log("Language: " + omdbResponse.Language);
                    console.log("Plot: " + omdbResponse.Plot);
                    console.log("Actors: " + omdbResponse.Actors);
                };
            };
            if (process.argv[4] === "save") {
                fs.writeFile("movie.txt", JSON.stringify(omdbResponse, null, '\t'), function(err) {
                    // If the code experiences any errors it will log the error to the console.
                    if (err) {
                        return console.log(err);
                    };
                });
            };
        });
    };
};

var doWhatItSays = function() {
    if (process.argv[3] === "--help") {
        console.log("");
        console.log("do-what-it-says   reads and executes the instructions contained in random.txt.  expected format for random.txt is '<command>,[<argument>]'");
    }
    else {
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
                return console.log(error);
            };
            var dataArr = data.split(",");
            if (dataArr[0] === "do-what-it-says") {
                console.log("I'm not falling for your recursion!");
            }
            else {
                userCommand = dataArr[0];
                fromRandom = dataArr[1];
                watDo();
            };
        });
    };
};

var educateUser = function() {
    console.log("liri.js: Invalid command or argument, or no command was specified.\n")
    console.log("Usage: node liri.js <command> [<args>]\n");
    console.log("liri.js has several commands, which each require different arguments.\n");
    console.log("get-tweets [<username>]      retrieves last 20 tweets from the specified Twitter username and displays them");
    console.log("my-tweets                    gently nudges the user into using 'get-tweets' instead");
    console.log("spotify-this-song [<song>]   searches Spotify and returns basic information about the specified song");
    console.log("movie-this [<movie>]         searches OMDb and returns basic information about the specified movie");
    console.log("do-what-it-says              reads and executes the instructions contained in random.txt.  expected format for random.txt is '<command>,[<argument>]'");
    console.log("");
    console.log("Type 'node liri.js <command> --help' for additional information about specific commands.");
};

var watDo = function() {
    switch(userCommand) {
        case "get-tweets":
        if (fromRandom) {
            getTweets(fromRandom);
        }
        else {
            getTweets();
        }
        break;
    
        case "my-tweets":
        myTweets();
        break;
    
        case "spotify-this-song":
        if (fromRandom) {
            getSpotify(fromRandom);
        }
        else {
            getSpotify();
        }
        break;
    
        case "movie-this":
        if (fromRandom) {
            movieSearch(fromRandom);
        }
        else {
            movieSearch();
        }
        break;
    
        case "do-what-it-says":
        doWhatItSays();
        break;
    
        // I personally never RTFM, so what better way to make me RTFM than to print out the manual itself?
        default:
        educateUser();
        break;
    };
};

watDo();