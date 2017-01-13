'use strict';

var books = require('google-books-search');
var Users = require('../models/users.js');

function ClickHandler() {

	this.getClicks = function(req, res) {
		Users
			.findOne({
				'github.id': req.user.github.id
			}, {
				'_id': false
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}

				res.json(result.nbrClicks);
			});
	};

	this.addClick = function(req, res) {
		Users
			.findOneAndUpdate({
				'github.id': req.user.github.id
			}, {
				$inc: {
					'nbrClicks.clicks': 1
				}
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}

				res.json(result.nbrClicks);
			});
	};

	this.resetClicks = function(req, res) {
		Users
			.findOneAndUpdate({
				'github.id': req.user.github.id
			}, {
				'nbrClicks.clicks': 0
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}

				res.json(result.nbrClicks);
			});
	};
	this.renderMain = function(req, res) {
		
		
		  Users.distinct("books",function(err,results){
		  //	res.json(results);
		  	
		  	res.render("main",{isAuthenticated:req.isAuthenticated(),books:results});	//Should be redone. Very bad mapping
		  });
		
  
    	





	};
	this.renderProfile = function(req, res) {
		Users.findOne({
				username: req.user.username
			},function(err,result){
				//console.log(result.requests);
				
				res.render("profile", {
			isAuthenticated: req.isAuthenticated(),
			books:result.books,
			requests:result.requests
			});

		});
	};
	this.addBook = function(req, res) {
		console.log(req.body.bookname);

		books.search(req.body.bookname, function(error, results) {
			try{
			if (error) {
				throw(error);
				
			}
			if(results.length>0){
				var book = {
				title: results[0].title,
				url: results[0].thumbnail.replace(/^http:\/\//i, 'https://')
			}
			console.log(book);
			
			Users.findOneAndUpdate({
				username: req.user.username
			}, {
				$push: {
					"books": book
				}
			}).exec(function(err, result) {
				if (err) {

					throw err;
				}
			})
			}
			else throw new Error("");
			res.redirect(req.originalUrl);
			}
			catch(err){
				res.render("profile",{isAuthenticated:req.isAuthenticated(),err:true,books:req.user.books});
			}

			//	console.log(req.user.books);
		
		});


	};
	this.signUp = function(req, res, next) {
		var adm = new Users();
		console.log(req.body.username + "||" + req.body.password);
		adm.username = req.body.username;
		adm.password = req.body.password;
		adm.save(function(err) {
			if (err)
				res.render("register", {
					err: true,
					isAuthenticated: req.isAuthenticated()
				});
			else
				next();
		});

	};
	this.getBook = function(req, res) {

		books.search(req.params.id, function(error, results) {
			// console.log(req.params.id+'hello');
			// console.log(req.originalUrl);
			if (!error) {
				res.json(results);
			}
			else {
				console.log(error);
			}
		});
	};
	this.initTrade=function(req,res){
		console.log('trade');
		var title=req.body.title;
		var user=req.user.username;
		Users.findOneAndUpdate({books:{$elemMatch:{ title :title }}},{$push:{"requests.ins":{title:title,user:user}}},function(err,result){
			if(result.username!==req.user.username)
				Users.findOneAndUpdate({username: req.user.username}, {$push: {"requests.out": {title:title,user:result.username}}}).exec(function(err, result) {
					if (err) {

						throw err;
					}
				res.end("/profile");
			});
			else{
				Users.findOneAndUpdate({books:{$elemMatch:{ title :title }}},{$pull:{"requests.ins":{title:title,user:user}}},function(err,result){
					
				});
				res.end("/")
			}
			
		})
	};
	this.acceptTrade=function(req,res){
		var title=req.body.title;
		var user=req.user.username;
		Users.findOneAndUpdate({"requests.ins":{$elemMatch:{ title :title }}},
		{
			$pull:{
				"requests.ins":{title:title},
				"books":{title:title}
				
			}
			
		},
		{
			projection:{ books: { $elemMatch: { title: title } } }
		}
		,function(err,result){
		//	console.log(result);

				Users.findOneAndUpdate({"requests.out":{$elemMatch:{ title :title }}},{
					$pull: {"requests.out": {title:title}},
					$push:{books:{title:result.books[0].title,url:result.books[0].url}}}).exec(function(err, result) {
					if (err) {

						throw err;
					}
				res.end("/profile");
			});
			
		})
	};
	
	this.declineTrade=function(req,res){

		var title=req.body.title;
		var user=req.user.username;
		console.log("declining "+title)
		Users.findOneAndUpdate({"requests.ins":{$elemMatch:{ title :title }}},{$pull:{"requests.ins":{title:title}}},function(err,result){
		//	console.log("result:"+result);

				Users.findOneAndUpdate({"requests.out":{$elemMatch:{ title :title }}},{$pull:{"requests.out":{title:title}}},function(err,result){
					if (err) {

						throw err;
					}
			console.log("result:"+result);
				res.end("/profile");
			});
			
		})
	};
}

module.exports = ClickHandler;
