const db = require('../models');
const { getCommunity } = require('./auth/validate');

const multer = require('multer')({ dest: 'client/build/images' });

const wrap = fn => (...args) => fn(...args).catch(args[2]); // async error handling

module.exports = function (app) {
  // COMMUNITY

  app.post('/api/communities/create', wrap(async function (req, res, next) { // create community
    const user = await db.User.findOne({
      where: {
        id: req.token.UserId
      }
    });

    const newCommunity = await db.Community.create({
      name: req.body.name,
      bio: req.body.bio,
      private: req.body.private
    });

    await newCommunity.addMember(user);
    newCommunity.setFounder(user);
    newCommunity.dataValues.founder = user;

    res.status(200).json(newCommunity);
  }));

  app.get('/api/communities', wrap(async function (req, res, next) { // get all public communities
    const user = await db.User.findOne({
      where: {
        id: req.token.UserId
      },
      include: [{
        model: db.Community,
        as: 'communities'
      }]
    });

    const commIds = user.communities.map(comm => { return comm.id; });

    const communities = await db.Community.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [db.op.notIn]: commIds
        },
        private: false
      },
      limit: 20
    });

    res.status(200).json(communities);
  }));

  app.get('/api/communities/:CommunityId', wrap(async function (req, res, next) { // get community info
    let { community, isMember } = await getCommunity(req.token.UserId, req.params.CommunityId);

    if (!isMember) {
      return res.status(200).json(community);
    }

    community = await db.Community.findOne({
      where: {
        id: community.id
      },
      include: [{
        model: db.Post,
        as: 'posts',
        limit: 20,
        where: {
          UserId: null,
          EventId: null
        },
        required: false
      },
      {
        model: db.Image,
        as: 'bannerImage',
        limit: 1
      },
      {
        model: db.Event,
        as: 'events',
        limit: 20
      }]
    });

    res.status(200).json(community);
  }));

  app.post('/api/communities/:CommunityId/images', multer.any(), wrap(async (req, res, next) => { // update community banner image
    const { community, isFounder } = await getCommunity(req.token.UserId, req.params.CommunityId);

    if (!isFounder) {
      throw { status: 401, msg: 'You don\'t own that community.' };
    }

    const image = await db.Image.create(req.files[0]);

    community.addBannerImage(image);

    res.json(image);
  }));

  app.delete('/api/communities/:CommunityId', wrap(async function (req, res, next) { // delete community
    const { community, isFounder } = await getCommunity(req.token.UserId, req.params.CommunityId);

    if (!isFounder) {
      throw { status: 401, msg: 'You don\'t own that community.' };
    }

    const delCommunity = await community.destroy();

    res.status(200).json(delCommunity);
  }));
};
