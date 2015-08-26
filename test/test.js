var assert = require('assert');

var Semaphore = require('./../index.js');  // our module

describe('Semaphore', function(){
  describe('Module Sempahore', function(){
  	var semaphore = new Semaphore({
      host: 'localhost',
      database: 'somedb',
      user: 'someuser',
      password: 'somepw'
    });
    it('should be object', function(){
    	assert.equal(typeof semaphore, 'object');
    });
    it('should have a lock Method', function(){
      assert.equal(typeof semaphore.lock, 'function');
    });
    it('should have an unlock Method', function(){
      assert.equal(typeof semaphore.unlock, 'function');
    });
    it('should have an islocked Method', function(){
      assert.equal(typeof semaphore.islocked, 'function');
    });
    it('should lock and unlock', function(){
    	semaphore.lock('test')
        .then(function(locked){
          semaphore.unlock('test')
            .then(function(unlocked){
              assert.equal(locked && unlocked, true);
            });
        });
    });
    it('should return true if locked', function(){
      semaphore.lock('test')
        .then(function(locked){
          semaphore.islocked('test')
            .then(function(islocked){
              assert.equal(locked && islocked, true);
              semaphore.unlock('test')
              .then(function(unlocked){});
            });
        });
    });
  })
}); 