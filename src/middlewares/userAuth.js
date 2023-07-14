const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables
const UserModel = require('../models/user/UserModel');

function authenticateToken(req, res, next) {
  try {
    const token = req.headers['x-token'];
    const userIdFromBody = req.body.userId;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
      }

      req.decoded = decoded; // Save the decoded payload for further use
      next();
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function authorizeValidateUser(req, res, next) {
  try {
    const token = req.headers['x-token'];
    const userIdFromBody = req.params.userid;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!userIdFromBody) {
      return res.status(400).json({ error: 'User ID is a required field' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = decoded; // Save the decoded payload for further use

    const user = await UserModel.userById(userIdFromBody);

    if (!user[0]) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    if (user[0].email !== req.decoded.email) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function authorizeAccessControll(req, res, next) {
  try {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = decoded; // Save the decoded payload for further use

    const user = await UserModel.userByEmail(req.decoded.email);

    if (!user[0]) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    if (user[0].email !== req.decoded.email) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    if (user[0].userrole !== req.decoded.userrole) {
      return res.status(401).json({ error: 'Invalid User Access' });
    }

    if (user[0].userrole !== 1) {
      return res.status(401).json({ error: 'You dont have permission' });
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function authorizeBranchControll(req, res, next) {
  try {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = decoded; // Save the decoded payload for further use

    const user = await UserModel.userByEmail(req.decoded.email);

    if (!user[0]) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    if (user[0].email !== req.decoded.email) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    if (user[0].userrole !== req.decoded.userrole) {
      return res.status(401).json({ error: 'Invalid User Access' });
    }

    if (user[0].userrole !== 1) {
      return res.status(401).json({ error: 'You dont have permission' });
    }

    if (user[0].branchid !== req.decoded.branchid) {
      return res.status(401).json({ error: 'You are not permited for this. because branch is diffrent' });
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
  authenticateToken,
  authorizeValidateUser,
  authorizeAccessControll
};
