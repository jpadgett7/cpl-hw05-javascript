'use strict';

var Helper = require('hubot-test-helper');
var expect = require('chai').expect;

var helper = new Helper('../scripts/remind-me.js');

describe('remind-me script', function() {

  // Configure mocha to use longer timout periods. We have to wait for
  // Hubot to respond to messages.
  this.slow(4000);
  this.timeout(6000);

  // Executed before each test. Used for setup.
  beforeEach(function() {
    this.room = helper.createRoom();
  });

  // Executed after each test. Used for cleanup.
  afterEach(function() {
    this.room.destroy();
  });

  it('reminds us to do stuff in a reasonable amount of time', function(done) {
    let room = this.room;

    room.user.say('meowth', 'hubot remind me to dance in 2 seconds')
      .then(function() {
        // After we talk to the Hubot, we wait 1000 milliseconds
        setTimeout(function() {
          // ... then we make sure that we see our message and the
          // acknowledgement
          expect(room.messages).to.eql([
            ['meowth', 'hubot remind me to dance in 2 seconds'],
            ['hubot', '@meowth OK. I\'ll remind you to dance in 2 seconds.'],
          ]);

          // ... then we wait another 1100 milliseconds
          setTimeout(function() {
            // ... and assert that we see our messages from before,
            // PLUS the actual reminder.
            expect(room.messages).to.eql([
              ['meowth', 'hubot remind me to dance in 2 seconds'],
              ['hubot', '@meowth OK. I\'ll remind you to dance in 2 seconds.'],
              ['hubot', '@meowth Don\'t forget to dance!']
            ]);

            // Async test is complete
            done();
          }, 1100);
        }, 1000);
      });
  });

  it('says the right thing', function(done) {
    let room = this.room;

    room.user.say('meowth', 'hubot remind me to dance in 1 second')
      .then(function() {
        // After we message the Hubot, we wait 1100 milliseconds
        setTimeout(function() {
          // ... then we make sure that we've seen all of the expected phrases.
          expect(room.messages).to.eql([
            ['meowth', 'hubot remind me to dance in 1 second'],
            ['hubot', '@meowth OK. I\'ll remind you to dance in 1 second.'],
            ['hubot', '@meowth Don\'t forget to dance!']
          ]);

          // Async test is complete
          done();
        }, 1100);
      });
  });
});
