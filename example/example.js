var config = {
	host: 'localhost',
	database: 'un_whd',
	user: 'root',
	password: 'p@ssw0rd'
};

var semaphore = require('./../index')(config);

semaphore.lock('test', 2)
	.then(function(locked){
		console.log('got a lock!', locked);

		semaphore.islocked('test')
			.then(function(locked){
				console.log('islocked', locked);

				semaphore.lock('test', 2)
					.then(function(locked){
						console.log('should be false ', locked);

						semaphore.unlock('test')
						.then(function(){
							console.log('unlocked!');
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