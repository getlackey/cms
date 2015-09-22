# Coding Conventions

All JS code is checked against JSlint. Make sure you have the appropriate lines on the top of every file. Eg.:
    
    /*jslint node:true */
    'use strict';

All file names are lowercase with only dashes (-) as separator.

All JS variables should be camelCase. Constructor functions start with a capital character.

## Options
In most places, options can be provided as an object, or as a string or even array which will be converted into a special options object. The short version of this is that 'opt1 opt2 op3:my_option' will be converted to:

    {
        opt1: 'opt1',
        opt2: 'opt2',
        opt3: 'my_option'
    }

There are additional methods. For instance to convert my_option to "My option". Please check the module [lackey-options-parser](https://www.npmjs.com/package/lackey-options-parser).

## Models
Model names are always sigular and lowercase.
Every required property in the model schema will be, by default, presented as an input in the CMS form. Each mongoose schema should be defined in it's own, exclusive, file. 

## Views
Files directly inside the /views folder should be main templates only. Any partials should be placed inside /views/_partials. 

## Controllers
Controller names are always plural. Be careful with collisions between controller names and folders in the /htdocs folder as it will throw a redirection loop due to the striping of trailing slashes from controller URLs.
