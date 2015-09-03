var config = {
	host: '',
	database: '',
	user: '',
	password: ''
};

var semaphore = require('./../index')(config);

semaphore.lock('test', 2)
	.then(function(didLock){
		console.log('got a lock: ', didLock);

		semaphore.islocked('test')
			.then(function(isLocked){
				console.log('check if locked: ', isLocked);

				semaphore.lock('test', 2)
					.then(function(triedLock){
						console.log('trying to lock a locked instance (should be false): ', triedLock);

						semaphore.unlock('test')
						.then(function(didUnlock){
							console.log('did unlock: ', didUnlock);
							semaphore.islocked('test')
								.then(function(isReallyUnLocked){
									console.log('is still locked: ', isReallyUnLocked);
								})
								.catch(function(err){
									console.log('err on checking unlocked', err);
								})
						})
						.catch(function(err){
							console.log('failed to unlock ', err);
						});
					})
					.catch(function(err){
						console.log('error validating lock', err);
					});
				
			}).catch(function(err){
				console.log('couldnt check lock');
			})
	})
	.catch(function(err){
		console.log('failed to lock: ', err);
	});