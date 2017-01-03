var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var favoriteSchema = new Schema({
  
  dishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  }],

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}}, 

  {
  timestamps: true

});

module.exports = mongoose.model('Favorites', favoriteSchema)
