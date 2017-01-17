'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(clickHandler.renderMain)
		.post(isLoggedIn,clickHandler.initTrade)
		.delete(isLoggedIn,clickHandler.declineTrade);


	app.route('/login')
		.get(function (req, res) {
			
			res.render("login",{isAuthenticated:req.isAuthenticated()});
		})
		.post(passport.authenticate('local',{ successRedirect: '/',failureRedirect: '/login' }),function(req, res) {
			console.log(req.body.username);
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/');
  });
  
  	app.route('/register')
		.get(function (req, res) {
			res.render("register",{isAuthenticated:req.isAuthenticated()});
		})
		.post(clickHandler.signUp,passport.authenticate('local'),function(req,res){
			res.redirect('/');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, clickHandler.renderProfile)
		.post(isLoggedIn,clickHandler.addBook);

	app.route('/api/trade')
		.post(isLoggedIn,clickHandler.acceptTrade)
		.delete(isLoggedIn,clickHandler.declineTrade);

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(clickHandler.getBook)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
