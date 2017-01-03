var express = require('express')
var bodyParser = require('body-parser')
var Favorites = require('../models/favorites')
var Verify = require('./verify')
var mongoose = require('mongoose');


var favoritesRouter = express.Router()
favoritesRouter.use(bodyParser.json())

/* Route '/' */

favoritesRouter
  .route('/')

  .all(Verify.verifyOrdinaryUser)

  .get(function (req, res, next) {
    var userId = req.decoded._doc._id
    Favorites.find({ postedBy: userId })
      .populate('postedBy dishes')
      .exec(function (err, dish) {
        if (err) return next(err)
        res.json(dish)
      })
  })

  .post(function (req, res, next) {

       Favorites.findOne(
        {postedBy: req.decoded._doc._id},
        function (err, favorite) {
          if(favorite == null) {
            Favorites.create(req.body, function (err, favorite) {
    
            if (err) throw err;
            console.log('favorite created!');
            var flag = isin(req.body._id, favorite.dishes)
            var id = favorite._id;
            favorite.postedBy = req.decoded._doc._id;
            if(!flag){
            favorite.dishes.push(req.body); 
            }
            favorite.save(function (err, favorite) {
                if (err) throw err;
                console.log('Updated Favorites!');
                res.json(favorite);
            })
            })
          }
          else {
            var flag = isin(req.body._id, favorite.dishes)
            if(!flag){
            favorite.dishes.push(req.body._id); 
            }
            favorite.save(function (err, favorite) {
            if (err) throw err;
            res.json(favorite);
            })
          }
    })
})

  .delete(function (req, res, next) {
   var userId = req.decoded._doc._id

    Favorites.find({ postedBy: userId })
      .exec(function (err, dish) {
         Favorites.remove({}, function (err, resp) {
            if (err) return next(err)
            })
        if (err) return next(err)
        res.json(dish)
      })
   
  })

// Handle duplicate entires in dishes array

function isin(n,a){
  for (var i=0;i<a.length;i++){
    if (a[i]== n){
    return true;

    }
  }
  return false;
}

favoritesRouter
  .route('/:dishId')
  .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findById(req.params.dishId, function (err, favorite) {
      if (err) next(err)
      var index = favorite.dishes.indexOf(req.params.dishId);
      if (index >= 0) {
        favorite.dishes.splice( index, 1 );
      }
      console.log(favorite.dishes)
      favorite.save(function (err, favorite) {
                if (err) throw err;
                console.log('Updated Favorites!');
                res.json(favorite);
            })
    })
  })


module.exports = favoritesRouter
