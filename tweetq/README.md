# Itreksjod - A twitter RPG crawler
Itreksjod is a virtual twitter Dunjeon Master.
It manages an Multi-player RPG game over twitter


## Set-up

### Prerequistes

* node
* A twitter dev account

### Install

* git clone it
* npm install
* find a twitter application key and put it in this.client variable
* design your own level in "level_1.json" ( more about the format soon )

### Run

* node itreksjod.js

You better use a daemonizer like forever


## Gameplay

Players can send tweet to @itreksjod.
They lead an adventurer who moves and looks for treasure in a (very ) basic dunjeon

Rounds last 5mn. Each 5mn, the bot gather command.
Some are replied to, some are used for a majority vote ( like "move" of fight commands").

Once an action is choosen, next round awaits and player canenter new commands. 
