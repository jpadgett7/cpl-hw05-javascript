'use strict';

var fs = require('fs');
var Helper = require('hubot-test-helper');
var path = require('path');
var rm = require('rimraf').sync;
var should = require('chai').should();
var tmp = require('tmp');
var _ = require('underscore');

/**
 * Any ol' function function that requires zero parameters. Its return
 * value will be ignored.
 *
 * @callback simpleCallback
 */

/**
 * Delays execution of a callback by 250 milliseconds.
 *
 * @param {simpleCallback} callback - The function to call after 250ms.
 */
function delay(callback) {
  setTimeout(callback, 250);
}

describe('todo script', function() {

  // Configure mocha to use longer timout periods. We have to wait for
  // Hubot to respond to messages.
  this.slow(1000);
  this.timeout(2000);

  // Executed before each test. Used for setup.
  beforeEach(function() {
    // Create a temporary directory...
    this.dataDir = tmp.dirSync().name;

    // Change to that directory
    process.chdir(this.dataDir);

    this.helper = new Helper('../scripts/todos.js');
    this.room = this.helper.createRoom();
  });

  // Executed after each test. Used for cleanup.
  afterEach(function() {
    this.room.destroy();

    // Remove the temporary directory when the test is over.
    rm(this.dataDir, {disableGlob: true});
  });

  it('creates a "todos" directory for todo items', function(done) {
    // Make sure it's making the "todos" directory for us.
    fs.stat('todos', function(err, stat) {
      should.not.exist(err);
      stat.isDirectory().should.be.true;

      // Async test is complete
      done();
    });
  });

  it('shows a message when the data file is empty', function(done) {
    let room = this.room;

    room.user.say('meowth', 'hubot show my todo list').then(function() {
      delay(function() {
        // If we haven't told hubot to track anything, then it's list
        // should be empty
        room.messages.should.eql([
          ['meowth', 'hubot show my todo list'],
          ['hubot', '@meowth The list is empty!']
        ]);

        // Async test is complete
        done();
      });
    });
  });

  it('shows a message when the data file isn\'t there', function(done) {
    let room = this.room;

    // Remove the todos directory and the temporary directory
    fs.rmdirSync(path.join(this.dataDir, 'todos'));
    fs.rmdirSync(path.join(this.dataDir));

    room.user.say('meowth', 'hubot show my todo list').then(function() {
      delay(function() {
        // Look for the error message
        room.messages.should.eql([
          ['meowth', 'hubot show my todo list'],
          ['hubot', '@meowth Oh no... I couldn\'t look for todos...']
        ]);

        // Async test is complete
        done();
      });
    });
  });

  it('lets us add an item', function(done) {
    let room = this.room;

    room.user.say('meowth', 'hubot add potato to my todo list')
      .then(function() {
        delay(function() {
          // Look for the acknowledgement
          room.messages.should.eql([
            ['meowth', 'hubot add potato to my todo list'],
            ['hubot', '@meowth OK! I added potato to the todo list']
          ]);

          // Async test is complete
          done();
        });
      });
  });

  it('lets us add a couple of items', function(done) {
    let room = this.room;
    let dataDir = this.dataDir;

    // Add "frog" to the list
    room.user.say('meowth', 'hubot add frog to my todo list')
      .then(function() {
        delay(function() {
          // Wait and add "submarine" to the list
          room.user.say('meowth', 'hubot add submarine to my todo list')
            .then(function() {
              delay(function() {
                // Check that we see both acknowledgements
                room.messages.should.eql([
                  ['meowth', 'hubot add frog to my todo list'],
                  ['hubot', '@meowth OK! I added frog to the todo list'],
                  ['meowth', 'hubot add submarine to my todo list'],
                  ['hubot', '@meowth OK! I added submarine to the todo list']
                ]);

                let todoDir = path.join(dataDir, 'todos');
                let filenames = _(fs.readdirSync(todoDir));

                // Read the contents from all of the data files
                // synchronously
                let data = filenames.map(function(fname) {
                  return fs.readFileSync(path.join(todoDir, fname), 'ascii');
                });

                // Assert that we see the file contents we expect
                data.should.have.members(['frog', 'submarine']);

                // Check that Hubot can read them, too
                room.user.say('meowth', 'hubot show my todo list')
                  .then(function() {
                    delay(function() {

                      // Verify that our request was sent
                      room.messages[4].should.eql(
                        ['meowth', 'hubot show my todo list']
                      );

                      // Now let's look at the rest of them...
                      let messages = room.messages.slice(5);

                      // Each message should be formatted as...
                      // <uuid>: <task>
                      _(messages).each(function(m) {
                        let name = m[0];
                        let msg = m[1];
                        name.should.equal('hubot');
                        msg.should.match(/@meowth [0-9a-f\-]{36}: .*/i);
                      });

                      // Get a list of all of the tasks
                      let todos = messages.map(function(m) {
                        let msg = m[1];
                        let match = /@meowth [0-9a-f\-]{36}: (.*)/i.exec(msg);
                        return match[1];
                      });

                      // Make sure there are only two, and that they
                      // match our requested tasks
                      todos.should.have.lengthOf(2);
                      todos.should.have.members(['frog', 'submarine']);

                      // Async test is complete
                      done();
                    });
                  });
              });
            });
        });
      });
  });

  it('lets us remove items', function(done) {
    let room = this.room;
    let dataDir = this.dataDir;

    // Add frog
    room.user.say('meowth', 'hubot add frog to my todo list')
      .then(function() {
        // Add submarine
        room.user.say('meowth', 'hubot add submarine to my todo list')
          .then(function() {
            delay(function() {
              // Check our list of files
              let todoDir = path.join(dataDir, 'todos');
              let files = fs.readdirSync(todoDir);

              // There better be two
              files.length.should.equal(2);

              // Here they are. All two of them.
              let f1 = files[0];
              let f2 = files[1];

              // Tell Hubot to remove the item associated with f1
              room.user.say('meowth', `hubot ${f1} is done`)
                .then(function() {
                  delay(function() {
                    // Slice the messages and check that we see an
                    // acknowledgment
                    room.messages.slice(4).should.eql([
                      ['meowth', `hubot ${f1} is done`],
                      ['hubot', `@meowth OK! Removed ${f1}`]
                    ]);

                    // Check the directory again. There should only be
                    // one file left.
                    let files = fs.readdirSync(todoDir);
                    files.should.have.lengthOf(1);

                    // Get the file and make sure it's the same as f2
                    // (we deleted f1).
                    let f3 = files[0];
                    f2.should.equal(f3);

                    // Async test is complete
                    done();
                  });
                });
            });
          });
      });
  });
});
