const db = require('../models');
const { getCommunity, getPost, getComment } = require('./auth/validate');

const wrap = fn => (...args) => fn(...args).catch(args[2]); // async error handling

module.exports = function (app) {
  // POST

  app.post('/api/posts', wrap(async function (req, res, next) { // make post of type implied by provided queryID(s) - for example: /api/posts?CommunityId=1&UserId=1
    const CommunityId = req.query.CommunityId;
    const UserId = req.query.UserId;
    const EventId = req.query.EventId;

    const { community, user, isMember } = await getCommunity(req.token.UserId, CommunityId);

    if (!isMember) {
      throw { status: 401, msg: 'You\'re not in that community.' };
    }

    if (!CommunityId && !UserId && !EventId) {
      throw { status: 400 };
    }

    let newPost;
    const makeNewPost = async req => {
      newPost = await db.Post.create({
        title: req.body.title,
        message: req.body.message
      });

      newPost.setAuthor(user);
      newPost.dataValues.author = user;
      return newPost;
    };

    if (EventId) {
      const [event] = await community.getEvents({
        where: {
          id: EventId
        }
      });

      if (!event) {
        throw { status: 404, msg: 'That event doesn\'t exist.' };
      }

      newPost = await makeNewPost(req);
      community.addPost(newPost);
      event.addPost(newPost);
    }
    else if (UserId) {
      if (req.token.UserId === UserId) {
        throw { status: 400, msg: 'You can\'t post on your own wall.' }; // for now
      }

      const [getUser] = await community.getMembers({
        where: {
          id: UserId
        }
      });

      if (!getUser) {
        throw { status: 401, msg: 'You aren\'t in a community with that user.' };
      }

      newPost = await makeNewPost(req);
      community.addPost(newPost);
      getUser.addPost(newPost);
    }
    else {
      newPost = await makeNewPost(req);
      community.addPost(newPost);
    }

    res.status(200).json(newPost);
  }));

  app.delete('/api/posts/:PostId', wrap(async function (req, res, next) { // delete post
    const { post, isAuthor } = await getPost(req.token.UserId, req.params.PostId);

    if (!isAuthor) {
      throw { status: 401, msg: 'You didn\'t make that post.' };
    }

    const delPost = await post.destroy();

    res.status(200).json(delPost);
  }));

  app.put('/api/posts/:PostId', wrap(async function (req, res, next) { // edit post
    const { post, isAuthor } = await getPost(req.token.UserId, req.params.PostId);
    const { isMember } = await getCommunity(req.token.UserId, post.CommunityId);

    if (!isMember) {
      throw { status: 401, msg: 'You\'re not in that community.' }; // can't edit posts to send messages to communities you're no longer in
    }

    if (!isAuthor) {
      throw { status: 401, msg: 'You didn\'t make that post.' };
    }

    const upPost = await post.update({ message: req.body.message });

    res.status(200).json(upPost);
  }));

  app.put('/api/posts/:PostId/:vote', wrap(async function (req, res, next) { // like/dislike post
    const { post } = await getPost(req.token.UserId, req.params.PostId);
    const { user, isMember } = await getCommunity(req.token.UserId, post.CommunityId);

    if (!isMember) {
      throw { status: 401, msg: 'You\'re not in that community.' };
    }

    if (await post.hasVoter(user)) {
      throw { status: 400, msg: 'You\'ve already voted on that post.' };
    }

    switch (req.params.vote) {
      case 'like':
        post.score += 1;
        break;
      case 'dislike':
        post.score -= 1;
        break;
      default:
        throw { status: 400, msg: 'Invalid vote type.' };
    }

    const upPost = await post.update({ score: post.score });
    post.addVoter(user);

    res.status(200).json(upPost);
  }));

  // POST COMMENTS

  app.post('/api/posts/:PostId/comments', wrap(async function (req, res, next) { // make comment on post
    const { post } = await getPost(req.token.UserId, req.params.PostId);
    const { user, isMember } = await getCommunity(req.token.UserId, post.CommunityId);

    if (!isMember) {
      throw { status: 401, msg: 'You\'re not in that community.' };
    }

    const newComment = await db.Comment.create({ message: req.body.message });
    newComment.setAuthor(user);
    newComment.dataValues.author = user;
    post.addComment(newComment);

    res.status(200).json(newComment);
  }));

  app.delete('/api/posts/:PostId/comments/:CommentId', wrap(async function (req, res, next) { // delete comment
    const { comment, isAuthor } = await getComment(req.token.UserId, req.params.CommentId);

    if (!isAuthor) {
      throw { status: 401, msg: 'You didn\'t make that comment.' };
    }

    const delComment = await comment.destroy();

    res.status(200).json(delComment);
  }));

  app.put('/api/posts/:PostId/comments/:CommentId', wrap(async function (req, res, next) { // edit comment
    const { comment, isAuthor } = await getComment(req.token.UserId, req.params.CommentId);

    if (!isAuthor) {
      throw { status: 401, msg: 'You didn\'t make that comment.' };
    }

    const { post } = await getPost(req.token.UserId, req.params.PostId);
    const { isMember } = await getCommunity(req.token.UserId, post.CommunityId);

    if (!isMember) {
      throw { status: 401, msg: 'You\'re not in that community.' };
    }

    const upComment = await comment.update({ message: req.body.message });

    res.status(200).json(upComment);
  }));
};
