(function(){

	exports = module.exports = function(config){

		if (!config || !config.host || !config.database)
			throw 'Database is not properly configured';

		var mysql      = require('mysql');
		var connection = mysql.createConnection(config);

		connection.on('error', function(err) {
		  throw err;
		});

		var getResult = function(rows){
			return Boolean((!rows || rows.length === 0) || rows[0].val);
		};

		var self = {

			lock: function(lockName, timeout){
				var promise = new Promise(function(resolve, reject){

					connection.beginTransaction(function(err){
						if (err){
							return connection.rollback(function(){
								return reject(err);
							});
						}

						connection.query('SELECT IF(coalesce(is_used_lock(' + mysql.escape(lockName) + '), 0) > 0,0, IF(coalesce(get_lock(' + mysql.escape(lockName) + ', ' + mysql.escape(timeout) + '), 0) > 0,1,0)) as val', function(err, rows) {
						  if (err){
						  	return connection.rollback(function(){
								return reject(err);
							});
						  }
						  connection.commit(function(err){
						  	if (err){
							  	return connection.rollback(function(){
									return reject(err);
								});
							}

							return resolve(getResult(rows));
						  })
						});
					})

				});

				return promise;
			},

			unlock: function(lockName){
				var promise = new Promise(function(resolve, reject){

					connection.query('SELECT RELEASE_LOCK(' + mysql.escape(lockName) +') as val', function(err, rows) {
					  if (err){
					  	return reject(err);
					  }

					  return resolve(getResult(rows));
					});
					
				});

				return promise;
			},

			islocked: function(lockName){
				var promise = new Promise(function(resolve, reject){

					connection.query('SELECT IS_USED_LOCK(' + mysql.escape(lockName) +') as val', function(err, rows) {
					  if (err){
					  	return reject(err);
					  }
					  return resolve(getResult(rows));
					});

				});

				return promise;
			}

		};

		return self;

	};

}).call(this);

