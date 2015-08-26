(function(){

	exports = module.exports = function(config){

		if (!config || !config.host || !config.database)
			throw 'Database is not properly configured';

		var mysql      = require('mysql');
		var connection = mysql.createConnection(config);

		var getVal = function(obj){
			return (obj && obj.val) ? obj.val : null;
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

						connection.query('SELECT IS_USED_LOCK(\'' + lockName +'\') as val', function(err, rows) {
							if (err){
								return connection.rollback(function(){
									return reject(err);
								});
							}
							if (!rows || rows.length === 0 || getVal(rows[0]) !== null){
								return resolve(false)
							}

							connection.query('SELECT GET_LOCK(\'' + lockName +'\', ' + timeout +') as val', function(err, rows) {
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

								resolve(true);
							  })
							});

						});
					})

				});

				return promise;
			},

			unlock: function(lockName){
				var promise = new Promise(function(resolve, reject){

					connection.query('SELECT RELEASE_LOCK(\'' + lockName +'\') as val', function(err, rows) {
					  if (err){
					  	return reject(err);
					  }
					  if (rows && rows.length > 0 && getVal(rows[0]) !== null){
					  	return resolve(true);
					  }
					  else{
					  	return resolve(false);
					  }
					});
					
				});

				return promise;
			},

			islocked: function(lockName){
				var promise = new Promise(function(resolve, reject){

					connection.query('SELECT IS_USED_LOCK(\'' + lockName +'\') as val', function(err, rows) {
					  if (err){
					  	return reject(err);
					  }
					  if (!rows || rows.length === 0){
					  	return resolve(false);
					  }
					  return resolve(rows[0]['val'] !== null);
					});

				});

				return promise;
			}

		};

		return self;

	};

}).call(this);

