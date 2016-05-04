module.exports = {
  index: function (req, res) {
    return res.view('admin');
  },

  countAll: function (req, res) {
		var aggregates = {
			
				notificationLog: function(done) {
          V1NotificationLog.count().then(function(count) {
            done(null, count);
          });
        },

			
				order: function(done) {
          V1Order.count().then(function(count) {
            done(null, count);
          });
        },

			
				user: function(done) {
          V1User.count().then(function(count) {
            done(null, count);
          });
        },

			
		};

    async.series(aggregates, function(err, results) {
			if(err) {
				console.log("Error encountered while trying to pull counts for all objects: #{util.inspect(err, {depth:null})}");
        res.json(500, results);
			} else {
				res.json(results);
			}
		});
  }
};
