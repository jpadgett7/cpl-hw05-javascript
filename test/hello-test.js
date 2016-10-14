'use strict';

var Helper = require('hubot-test-helper');
var expect = require('chai').expect;

var helper = new Helper('../scripts/hello.js');

describe('hello script', function() {

  // Executed before each test. Used for setup.
  beforeEach(function() {
    this.room = helper.createRoom();
  });

  // Executed after each test. Used for cleanup.
  afterEach(function() {
    this.room.destroy();
  });

  it('says hi in response to "hubot hi"', function() {
    let room = this.room;

    // Return a Promise (look it up)
    return room.user.say('meowth', 'hubot hi').then(function() {
      expect(room.messages).to.eql([
        ['meowth', 'hubot hi'], ['hubot', '@meowth hey there']
      ]);
    });
  });

  it('says hi in response to "Hubot hi"', function() {
    let room = this.room;

    // Return a Promise (look it up)
    return room.user.say('meowth', 'Hubot hi').then(function() {
      expect(room.messages).to.eql([
        ['meowth', 'Hubot hi'], ['hubot', '@meowth hey there']
      ]);
    });
  });

  it('says hi in response to "hi hubot"', function() {
    let room = this.room;

    // Return a Promise (look it up)
    return room.user.say('meowth', 'hi hubot').then(function() {
      expect(room.messages).to.eql([
        ['meowth', 'hi hubot'], ['hubot', '@meowth hey there']
      ]);
    });
  });

  it('says hi in response to "hi Hubot"', function() {
    let room = this.room;

    // Return a Promise (look it up)
    return this.room.user.say('meowth', 'hi Hubot').then(function() {
      expect(room.messages).to.eql([
        ['meowth', 'hi Hubot'], ['hubot', '@meowth hey there']
      ]);
    });
  });
});
