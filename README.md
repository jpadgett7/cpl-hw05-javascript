# Chansiri

Chansiri is a [Hubot](http://hubot.github.com) designed to assist Team Rocket Executives with some simple tasks.

This project contains several scripts (within the `scripts/` directory) that will enable a Hubot to perform several useful actions.
Documentation for its behavior can be found publicly here: <http://cpl.mwisely.xyz>.
To verify that the code works properly, your code must pass the provided tests.
A sample conversation has been included for comparison.

**Note: Follow the documentation in the source code.**
Failure to do so may cause the existing test suite to fail and hurt your grade.

**Note: the following procedure will work on campus machines.**
**If you use your own machine for development, you are on your own.**

## A note on Git

**Do not** commit any of the following:

- The `bin` link made by `setup.sh`
- The `.my_nodejs` directory, which contains the downloaded and unpacked copy of Node.js
- The `node_modules` directory, which contains downloaded third-party libraries

They should be ignored automatically by Git, but still.
Don't commit them.

## Install a local copy of Node.js

The version of Node.js on campus machines is too old.
You will have to download a copy of a more recent version.

`setup.sh` will download, verify, and unpack a copy of Node.js v4.6.0 in a hidden directory in your repository.
Then, it'll create a link named `bin`, which you can use to access the `node` and `npm` executables that were installed.

~~~ shell
$ bash setup.sh

# ... a bunch of output ...

node-v4.6.0-linux-x64.tar.xz: OK
$ ./bin/node
>
~~~

Hooray!

## Install Prerequisite Packages

~~~ shell
$ ./bin/npm install -d
~~~~

This will have `npm` install the necessary packages listed in the `package.json` file.
You'll have to run this before you run your Hubot, the tests, or the style checker.

You will see a lot (like, a **lot**) of output fly by.
Be patient.

## Run Tests

~~~ shell
$ ./mocha.sh
~~~~

This will run the `Mocha` package which runs the tests in the `test` directory.
The options in `test/mocha.opts` tells `mocha` to compile any CoffeeScript files from the Hubot library into JavaScript prior to executing them.

**Don't rename or remove the `test` directory, `mocha` needs this.**

## Check Style

~~~ shell
$ ./jscs.sh scripts/*.js test/*.js
~~~~

This will run the `jscs` package to check for possible style and logic errors in `scripts/` and `test/`.

## Run the Program

~~~ shell
$ ./hubot.sh
Hubot>
~~~

This will invoke Hubot.
Hubot will then look in `scripts/` for Chansiri's custom scripts.

<!-- LocalWords: executables REPL js Hubot hubot Chansiri -->
<!-- LocalWords: npm json jscs Chansiri's -->
