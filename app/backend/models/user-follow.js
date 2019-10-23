const {mongoose} =  require('../db');  // The mongodb connector library

let UserFollow = mongoose.model('UserFollow', {
  FollowingId: {
    type: String,
    require: true
  },

  FollowingName: {
    type: String,
    require: true    
  },

  FollowingSurname: {
    type: String,
    require: true    
  },

  FollowedId: {
    type: String,
    require: true
  },

  FollowedName: {
    type: String,
    require: true    
  },

  FollowedSurname: {
    type: String,
    require: true    
  },

  status: {
    type: Boolean,
    require: true
  }
});

module.exports = {
  UserFollow: UserFollow
}