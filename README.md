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

The config file can be found in /config. Check the [documentation](https://github.com/lorenwest/node-config/wiki/Configuration-Files).

This project accepts 2 environment properties:

- NODE_ENV 
- PORT

NODE_ENV has to be one of **development**, **staging** or **production**. By default it will be set as development. Take a look at "[The drastic effects of omitting NODE_ENV in your Express.js applications](http://apmblog.dynatrace.com/2015/07/22/the-drastic-effects-of-omitting-node_env-in-your-express-js-applications/)"

PORT can be an HTTP Port or an Unix Domain Socket. By default it will be port 8000.
 

## App Login
This is the default authentication. Please update it as soon as possible.

- username: admin@lackey.io
- password: lackeyio

