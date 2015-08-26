A semaphore handler for Node.js and MySQL. Allows you to generate a semaphore in a clustered Node.js environment using MySQL. This is useful for such things as cron jobs or long running tasks that you only want to occur on a single instance. 

Requirements:
MySQL server

### Installation

```sh
npm install mysql-semaphore --save
```

### Initialization:

Refer to node-mysql (https://github.com/felixge/node-mysql/) for MySql configuration settings.

```sh
var Semaphore = require('mysql-semaphore');
var semaphore = new Semaphore({host: 'localhost', database: 'mydb', user: 'someuser', password: 'somepassword'});
```

### Methods:

#### Get Lock

```sh
semaphore.lock('test', 2)
	.then(function(locked){
		//locked will be true if lock is successful, false if unable to attain a lock
		console.log(locked);
	})
	.catch(function(err){
		console.log(err);
	});
```

#### Release Lock

```sh
semaphore.unlock('test')
	.then(function(){
		console.log('unlocked!');
	})
	.catch(function(err){
		console.log(err);
	});
```

#### Check If Locked

```sh
semaphore.islocked('test')
	.then(function(locked){
		console.log('islocked', locked);
	})
	.catch(function(err){
		console.log(err);
	})
```


### Tests:

```sh
npm test
```