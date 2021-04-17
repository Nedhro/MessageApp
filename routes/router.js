const express = require("express");
const mongoose = require("mongoose");
const registerTemplate = require("../model/User");

const router = express.Router();

router.get("/users", (req, res, next) => {
  registerTemplate
    .find()
    .select("name email regDate")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        users: docs.map((doc) => {
          return {
            name: doc.name,
            email: doc.email,
            regDate: doc.regDate,
            _id: doc._id,
          };
        }),
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/register", (req, res, next) => {
  let errors = {};
  registerTemplate
    .findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        errors = "UserName already exists";
        return res.status(400).json({ errors: errors, status: 400 });
      } else {
        const newUser = new registerTemplate({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        console.log(newUser);
        newUser
          .save()
          .then((data) => {
            res.json({
              message: "User created successfully",
              result: data,
              status: 201,
            });
          })
          .catch((err) => {
            console.log(err);
            res.json({
              error: err,
              status: 500,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/user/:email", (req, res, next) => {
  const email = req.params.email;
  registerTemplate
    .findOne({ email: email })
    .select("_id name email regDate")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          user: doc,
          status: 200,
        });
      } else {
        res.json({
          message: "No valid entry found for the email",
          status: 400,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/user/:userId", (req, res, next) => {
  const id = req.params.userId;
  registerTemplate
    .findById(id)
    .select("_id name email regDate")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          user: doc,
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/user/:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  registerTemplate
    .update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User updated",
        user: result,
        status: 200,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
        status: 500,
      });
    });
});

router.post('/login', (request, response)=> {
    let username = request.body.userName;
    let password = request.body.password;
    if (email === process.env.USER1 && password === process.env.PASS1) {
      response.send({
        message:"Logged in Successfully...",
        status: 200,
        email: email,
        isAuthenticated: true
      });
    } else if(email === process.env.USER2 && password === process.env.PASS2){
        response.send({
            message:"Logged in Successfully...",
            status: 200,
            email: email,
            isAuthenticated: true
          });
    } else {
      response.send({
        message:"Bad Request",
        status: 400
      });
      response.end();
    }
  });

module.exports = router ;
