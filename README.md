LIRI readme
===========

LIRI is a CLI applet to pull specific types of data from Twitter, Spotify, or OMDb.

This guide is written assuming that your current working directory is the directory that contains liri.js.

Twitter
-------

Usage:  Type `node liri.js get-tweets [&lt;username&gt;]`, where `[&lt;username&gt;]` is a Twitter username (what you'd see after "twitter.com/").  You will then see the 20 latest tweets from the specified user.

Spotify
-------

Usage:  Type `node liri.js spotify-this-song [&lt;song&gt;]`, where `[&lt;song&gt;]` is the name of a song.  You will then see matching results.  Each result will give you the artist(s), track name, preview URL (if applicable), and album that the song is from.

OMDb
----

Usage:  Type `node liri.js movie-this [&lt;movie&gt;]`, where `[&lt;movie&gt;]` is the title of a movie.  You will then see information about that specific movie.

Other
-----

There is some other functionality, but please feel free to run the applet itself.  It has built-in help.