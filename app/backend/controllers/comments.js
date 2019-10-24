/*
  Post method for comments.
  It saves comment to database.
*/
module.exports.postComment = async (request, response) => {
  let Comment = request.models['Comment']

  if(!request.body.related || !request.body.text){
    return response.status(400).send({
      errmsg: "Related field or text is missing in body!"
    })
  }

    // Comment instance to add to the database
  let comment = new Comment({
    ...request.body,
    userId: request.session['user']._id,
    date: new Date()
  });

  // Saves the instance into the database, returns any error occured
  comment.save()
    .then(doc => {
    return response.status(204).send();
  }).catch(error => {
    return response.status(400).send(error);
  });
}

/*
  Get method for comments.
  It returns given comment.
*/
module.exports.getComment = async (request, response) => {
  let Comment = request.models['Comment']

  comment = await Comment.findOne({ _id : request.params['id']});

  if(comment){
    return response.send(comment)
  } else {
    return response.status(400).send({
      errmsg: "No such comment."
    })
  }
}

/*
  Delete method for comments.
  It deletes given comment.
*/
module.exports.deleteComment = async (request, response) => {
  let Comment = request.models['Comment']

  Comment.deleteOne({ _id : request.params['id'], userId : request.session['user']._id }, (err, results) => {
    if(err){
      return response.status(404).send({
        errmsg: "Failed."
      })
    }

    return response.send(204);
  });
}
