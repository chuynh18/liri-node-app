LIRI readme
===========

LIRI is a CLI applet to pull specific types of data from Twitter, Spotify, or OMDb.  This guide is written assuming that your current working directory contains liri.js.

**Note:  If your query contains spaces, escape them with a backslash or use quotes.  I don't support bad behavior, so learn to CLI kthx**

Twitter
-------

Usage:  Type `node liri.js get-tweets [<username>]`, where `[<username>]` is a Twitter username (what you'd see after "twitter.com/").  You will then see the 20 latest tweets from the specified user.

Spotify
-------

Usage:  Type `node liri.js spotify-this-song [<song>]`, where `[<song>]` is the name of a song.  You will then see matching results.  Each result will give you the artist(s), track name, preview URL (if applicable), and album that the song is from.

OMDb
----

Usage:  Type `node liri.js movie-this [<movie>]`, where `[<movie>]` is the title of a movie.  You will then see information about that specific movie.

Other
-----

There is some other functionality, but please feel free to run the applet itself.  It has built-in help.