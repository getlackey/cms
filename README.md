# Lackey CMS

## Installation

Nodejs and MongoDb need to be already installed in the system.

If you don't have Bower and Grunt already installed:

	$ npm install -g grunt-cli
	$ npm install -g bower
	
Then:

    $ cd app
    $ npm install
    $ bower install
    $ grunt build
    
You can then run the app with either:

    $ grunt 

Or

    $ npm start

Grunts default task uses supervisor and watch to keep updating when any file is changed. Keep an eye on the shell messages as the compile steps may break. 

## Configuration

The config file can be found in /config. Check https://github.com/lorenwest/node-config/wiki/Configuration-Files for documentation.

This project accepts 2 environment properties:

- NODE_ENV 
- PORT

NODE_ENV has to be one of **development**, **staging** or **production**. By default it will be set as development.

PORT can be an HTTP Port or an Unix Domain Socket. By default it will be port 8000.
 

## App Login

username: admin@lackey.io
password: lackeyio

