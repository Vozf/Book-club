'use strict';

//var GitHubStrategy = require('passport-github').Strategy;

// var BasicStrategy           = require('passport-http').BasicStrategy;
// var ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy;
// var BearerStrategy          = require('passport-http-bearer').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
//var configAuth = require('./auth');


module.exports = function (passport) {

	// var adm=new User();
	// adm.username="admin@a.a";
	// adm.password="admin";
	// adm.save();

	
	
	
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	

	// passport.use(new GitHubStrategy({
	// 	clientID: configAuth.githubAuth.clientID,
	// 	clientSecret: configAuth.githubAuth.clientSecret,
	// 	callbackURL: configAuth.githubAuth.callbackURL 
	// }, function (token, refreshToken, profile, done) {
	// 	process.nextTick(function () {
	// 		User.findOne({ 'github.id': profile.id }, function (err, user) {
	// 			if (err) {
	// 				return done(err);
	// 			}

	// 			if (user) {
	// 				return done(null, user);
	// 			} else {
	// 				var newUser = new User();

	// 				newUser.github.id = profile.id;
	// 				newUser.github.username = profile.username;
	// 				newUser.github.displayName = profile.displayName;
	// 				newUser.github.publicRepos = profile._json.public_repos;
	// 				newUser.nbrClicks.clicks = 0;

	// 				newUser.save(function (err) {
	// 					if (err) {
	// 						throw err;
	// 					}

	// 					return done(null, newUser);
	// 				});
	// 			}
	// 		});
	// 	});
	// }));


passport.use(new LocalStrategy(
  function(username, password, done) {
  	console.log("sup");
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.checkPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
};
