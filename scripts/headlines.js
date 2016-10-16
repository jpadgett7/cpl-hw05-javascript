// Description:
//   Fetches headlines from a remote site
//
// Dependencies:
//   "request": "2.75.0"
//
// Configuration:
//   HEADLINE_URL: The URL to use for fetching newline-delimited
//       headlines. Defaults to http://cpl.mwisely.xyz/hw/6/headlines.txt
//
// Commands:
//   hubot show me a headline - Go fetch a random headline
//
// Notes:
//   This script pulls headlines from HEADLINE_URL. That means that
//   this script will need access to the Internet.
//
'use strict';
var request = require('request');
var s = require('underscore.string');
var _ = require('underscore');

var HEADLINE_URL = process.env.HEADLINE_URL;
if (HEADLINE_URL == null) {
  HEADLINE_URL = 'http://cpl.mwisely.xyz/hw/5/headlines.txt';
}

module.exports = function(robot) {

  // Handler for 'hubot show me a headline'
  robot.respond(/show me a headline$/i, function(msg) {
    // Use the `request` library (which is already installed by NPM) to
    // send a request to HEADLINE_URL. When the request is complete, the
    // provided callback will receive three parameters: `error`,
    // `response`, and `body`.

    // If the error parameter **has no value** (hint, hint) or if the
    // response's status code is not 200 (`HTTP OK`), then the hubot
    // should reply with:

    // > I couldn't get any headlines...

    // Otherwise, the request must have succeeded. In that case, the
    // hubot should reply with a random headline from the
    // newline-delimited response body. The hubot should never reply
    // with an empty headline.

    // If there were zero lines with content (i.e., the page was only
    // whitespace (new lines, carriage returns, tabs, etc.), then the
    // hubot should reply with:

    // > The headline site was empty!
    request(HEADLINE_URL, function (error, response, body) {
        if (!error && response.statusCode != 200) {
            msg.reply('I couldn\'t get any headlines...');
        }
        else {
            // huh
        }
    })
  });
};
