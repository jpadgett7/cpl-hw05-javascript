// Description:
//   Say hello, Hubot!
//
// Commands:
//   hubot hi - say hi
//   hi hubot - say hi
//
'use strict';

module.exports = function(robot) {

  // This script is actually done. It's mostly here as a reference if
  // you're wondering how a simple Hubot script looks.

  // Handler for "hi hubot"
  robot.hear(/^hi (.*)$/i, function(msg) {
    let name = msg.match[1];

    // Disregard case when we check for the name
    if (name.toLowerCase() === robot.name.toLowerCase()) {
      msg.reply('hey there');
    }
  });

  // Handler for "hubot hi"
  robot.respond(/hi$/i, function(msg) {
    msg.reply('hey there');
  });
};
