const express = require("express");
const router = express.Router();
const db = require('../models')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const API = require("../utils/API");
require("dotenv").config()

router.use(cors())

// Checks user authentication
const checkAuthStatus = (request, res) => {
    if (!request.headers.authorization) {
        return false
    }
    const token = request.headers.authorization.split(" ")[1]
    const loggedInUser = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
           return false;
        }
        else {
            return data
        }
    });
    return loggedInUser
}

// Login Route
router.post("/login", async (req, res) => {
    const foundUser = db.User.findOne({email: req.body.email})
      .then(foundUser => {
          if (!foundUser) {
            return res.status(404).send("USER NOT FOUND")
          } else {
            return bcrypt.compare(req.body.password, foundUser.password);
          } 
      })
      .then(function(samePassword) {
          if(!samePassword) {
              res.status(403).send("wrong password");
          } else {
              const userInfo = {
                  email: foundUser.email,
                  username: foundUser.username,
                  password: foundUser.password,
                  userToken: API.fetchToken()
              }
              const token = jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: "2h" });
              return res.status(200).json({ token: token })
          }
      })
      .catch(function(error){
          console.log("Error authenticating user: ");
      });
})
    
// Gets My Plants with user authentication

router.get("/myplants", (req, res) => {
    const loggedInUser = checkAuthStatus(req)
    if (!loggedInUser) {
        return res.status(401).send("invalid token")
    } else {
        db.User.find({ username: loggedInUser.username })
            .then((result) => {
             return res.json(result)
         })
         .catch((err) => {
            return res.json(err)
        })
    }
  })


module.exports = router;