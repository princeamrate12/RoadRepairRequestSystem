#! /usr/bin/env node

/*
console.log('This script populates some test products, users and bids to our database. Specified database as argument - e.g.: populatedb mongodb://localhost/rrrs');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return
}
*/

var async = require('async');
var Request = require('./models/user');
var User = require('./models/request');


var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/rrrs';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var requests = []

//Define UserCreate function
function userCreate(first_name, last_name, email, mobile, password, user_type, cb) {
	var userDetail = {
		first_name: first_name,
		last_name: last_name,
		email: email,
		mobile: mobile,
		password: password,
		user_type: user_type
	}

	var user = new User(userDetail);
	user.save(function (err) {
		if (err) {
			cb(err, null)
			return
		}
		console.log('New User: ' + user);
		users.push(user)
		cb(null, user)
	});
}

//Define RequestCreate function
// function requestCreate(user, address, status, engineer, contractor, cb) {
// 	var requestDetail = {
// 		user: user,
// 		address: address,
// 		status: status,
// 		engineer: engineer,
// 		contractor: contractor
// 	}
// 	var request = new Request(requestDetail);
// 	request.save(function (err) {
// 		if (err) {
// 			cb(err, null)
// 			return
// 		}
// 		console.log('New Request: ' + request);
// 		requests.push(request)
// 		cb(null, request)
// 	});
// }

//Create Users Serially
function createUsers(cb) {
	async.series([
		function (callback) {
			userCreate('Nilesh', 'Prajapat', 'nilesh@gmail.com', 8982116764, '123', 'user', callback);
		},
		function (callback) {
			userCreate('Murtaza', 'Mehmudji', 'murtaza@gmail.com', 8109861206, '123', 'engineer', callback);
		},
		function (callback) {
			userCreate('Chandra Pratap', 'Mandloi', 'chandra@gmail.com', 9644069108, '123', 'admin', callback);
		},
		function (callback) {
			userCreate('Rajnish Pratap', 'Singh', 'rajnish@gmail.com', 8359808247, '123', 'contractor', callback);
		},
	],
		// optional callback
		cb);
}

//Create Requests Serially
// function createRequests(cb) {
// 	async.series([
// 		function (callback) {
// 			requestCreate(users[0], {lat: 22.15236541852469, lng:75.25698547823145}, 'submitted', users[1], users[3], callback);
// 		},
// 		function (callback) {
// 			requestCreate(users[0], {lat: 22.15485235478529, lng: 75.24852365412545}, 'contractorAlloted', users[1], users[3], callback);
// 		},
// 		function (callback) {
// 			requestCreate(users[0], {lat: 22.75896325419654, lng: 75.36521458965412}, 'engineerAlloted', users[1], users[3], callback);
// 		},
// 		function (callback) {
// 			requestCreate(users[0], {lat: 22.75412563259465, lng: 75.65412398523458}, 'completed', users[1], users[3], callback);
// 		},
// 		function (callback) {
// 			requestCreate(users[0], {lat: 22.13256954215635, lng: 75.75412563547852}, 'processing', users[1], users[3], callback);
// 		},
// 	],
// 		// optional callback
// 		cb);
// }

//Execute Database Creation

async.series([
	createUsers,
	// createRequests
],
	// Optional callback
	function (err, results) {
		if (err) {
			console.log('FINAL ERR: ' + err);
		}
		else {
			console.log('Requests: ');

		}
		// All done, disconnect from database
		mongoose.connection.close();
	}
);