# Comics Generator - manganese

## TODO

- add doc
- add simple index example
- add sharable widget code

## Explanation

This is a very simple flat file static api generator to publish and share comics published over FTP

You need to know how to properly configurate a webserver.Then :
- gen_index.sh generate a json index of comics from a folder structure
- manganese.js allow to share the comics
- index.html is an exemaple

## Avantages

- it s very easy for publisher/authors
- it s make sharing comics very easy (think youtube embedded players for Turbomedia)
- it fucking fast and do not need a very powerful server (a low-end one is able to serv about 10 000 reader an hour with a mere 5% cpu)

## Inconvenient

it not easy to install
Publication time (aka time from publication ont he FTP to availability on the internet ) can be around 5mn
