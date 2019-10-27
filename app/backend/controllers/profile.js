const bcrypt = require('bcryptjs');
let { User } = require('./../models/user.js');  // The connection to the User model in the database

const {findUserFollows} = require('../utils')
/*
  Get method for profile page.
  Get user id from parameter and responses accordingly.
*/
module.exports.getDetails = async (request, response) => {
  let UserFollow = request.models['UserFollow']
  let User = request.models['User']
  
  const requestedUserId = request.params['id']
  const currentUser = request.session['user']

  try {
    if(currentUser && currentUser._id == requestedUserId) {  // when the user asks for his own details
      // retrieves the details about the people he follows and his followers
      const followings = await findUserFollows({ FollowingId: requestedUserId, status: true })

      const followers = await findUserFollows({ FollowedId: requestedUserId, status: true })

      const followRequests = await findUserFollows({ FollowedId: requestedUserId, status: false})
      return response.send({
        currentUser,
        followings,
        followers,
        followRequests
      })
    } else {  // when the user requested isn't the user logged in himself
      const requestedUser = await User.findOne({ _id : requestedUserId })   // finds the user instance requested if it exists
      if(requestedUser){ // if such user exists
        if(requestedUser.isPublic){ // if user's profile is public, returns it directly
          const { _id, isTrader, isPublic, name, surname, email, location } = requestedUser    // Extract certain keys from doc
          followings = await findUserFollows({ FollowingId: requestedUserId, status: true })
          followers = await findUserFollows({ FollowingId: requestedUserId, status: true })
          
          return response.send({
            _id, isTrader, isPublic, name, surname, email, location,
            followings,
            followers
          })
        } else { // when user's profile is private, checks if the logged-in user has privilege to view it
          if(currentUser){  // when the request came from another user logged in
            // following status between users
            const status = await UserFollow.findOne({ FollowingId : currentUser._id, FollowedId : requestedUser._id, status: true })
            if(status){   // when currently logged-in user is following the user whose details are requested
              const { _id, isTrader, isPublic, name, surname, email, location } = requestedUser    // Extract certain keys from doc
              followings = await findUserFollows({ FollowingId: requestedUserId, status: true })
              followers = await findUserFollows({ FollowedId: requestedUserId, status: true })
          
              return response.send({
                _id, isTrader, isPublic, name, surname, email, location,
                followings,
                followers
              })
            } else {  // when currently logged-in user is not following the user whose details are requested and private
              const {name, surname, isPublic} = requestedUser
              return response.send({name, surname, isPublic})
            }
          } else {    // when an anonymous user requested the profile details of a user with privacy preference on
              const {name, surname, isPublic} = requestedUser
              return response.send({name, surname, isPublic})
          }
        }
      } else {  // when there's no user with given ID
        return response.status(400).send({
          errmsg: "No such user."
        })
      }
    }
  } catch (error) {
    return response.status(400).send({errmsg: 'Unexpected error occured. Please check the request context and try again.'})
  }
}

/*
  Get method for following user.
*/
module.exports.followUser = async (request, response) => {
  const UserFollow = request.models['UserFollow']
  const User = request.models['User']
  
  let followingId = request.session['user']._id
  let followedId = request.params['id']

  follower = await User.findOne({ _id : followedId })

  if(follower){ // If user exists
    status = await UserFollow.findOne({ FollowingId : followingId, FollowedId : followedId })

    if(!status){ // If not following right now
      let follow = new UserFollow({
        FollowingId: followingId,
        FollowedId: followedId,
      });

      if(follower.isPublic){ // If user is public
        follow.status = true
      } else {
        follow.status = false
      }

    follow.save()
      .then(doc => {
        return response.status(204).send();
      }).catch(error => {
        return response.status(400).send(error);
      });
    } else {
        return response.status(400).send({
          errmsg: "Already following or requested to follow that user."
        })
    }
  } else {
      return response.status(400).send({
      errmsg: "No such user."
    })
  }
}

/*
  Get method for unfollowing user.
*/
module.exports.unfollowUser = async (request, response) => {
  let UserFollow = request.models['UserFollow']

  const followingId = request.session['user']._id
  const followedId = request.params['id']
  
  UserFollow.deleteOne({ FollowingId : followingId, FollowedId : followedId }, (err, results) => {
    if(err){
      return response.status(404).send({
        errmsg: "Failed."
      })
    }

    return response.sendStatus(204);
  });
}

/*
  Get method for accepting user follow request.
*/
module.exports.acceptRequest = async (request, response) => {
  let UserFollow = request.models['UserFollow']

  const followingId = request.session['user']._id
  const requestId = request.params['id']

  req = await UserFollow.findOne({ _id : requestId, FollowedId: request.session['user']._id, status: false})

  // If there exists such request
  if(req){ 
    req.status = true;

    // Save it into user-follow table
    req.save() 
      .then(doc => {
        return response.status(204).send();
      }).catch(error => {
        return response.status(400).send(error);
      });    
  } else {
    response.status(400).send({
      errmsg: "No such request."
    })
  }
  
}

/*
  Get method for rejecting user follow request.
*/
module.exports.rejectRequest = async (request, response) => {
  const UserFollow = request.models['UserFollow']
  
  const requestId = request.params['id']

  await UserFollow.deleteOne({ _id : requestId, FollowedId: request.session['user']._id, status: false }, (err, results) => {
    if(err){
      return response.status(404).send({
        errmsg: "Failed."
      })
    }
    
    return response.sendStatus(204);
  })
}

