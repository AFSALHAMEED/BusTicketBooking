const router = require("express").Router();

const User = require("../models/usersModel");

const bcrypt = require("bcryptjs"); // for hashing and salting

const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");


// register new user

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.send({
        message: "user already exist",
        success: false,
        data: null,
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      message: "user created successfull",
      success: true,
      data: null,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// login user

router.post("/login", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) {
     return res.send({
        message: "user doesnot exist",
        success: false,
        data: null,
      });
    }

    if(userExists.isBlocked){
         return  res.status(500).send({
          message: "user is blocked",
          success: false,
          data: null,
         })
    }
    const passwordmatch = await bcrypt.compare(
      req.body.password,
      userExists.password
    );
    if (!passwordmatch) {
      res.send({
        message: "incorrect password",
        success: false,
        data: null,
      });
    }
    const token = jwt.sign({ userId: userExists.id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });
    res.send({
      message: "logged in successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// get user by id

router.post("/get-user-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    return res.send({
      message: "User Fetched Successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});


// get all users

router.post("/get-all-users",authMiddleware,async (req,res)=>{
  try {
    const allUsers = await User.find()
res.status(200).send({
  message:"Users fetched successfully",
  success:true,
  data:allUsers
})
  } catch (error) {
    res.status(500).send({
      message:"Failed To Fetch",
      success:false,
      data:error
    })
  }
})

// update user

router.post("/update-user",authMiddleware, async (req,res)=>{
  try {
    await User.findByIdAndUpdate(req.body._id,req.body)
    res.status(200).send({
      message:"updated successfully",
      success:true,
      data:null
    })
  } catch (error) {
    res.status(500).send({
      message:"Failed To Fetch",
      success:false,
      data:error
    })
  }
})

module.exports = router;
