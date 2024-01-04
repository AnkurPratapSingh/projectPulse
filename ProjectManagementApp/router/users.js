const express = require("express");
const connection = require("../connection");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  signup,
  login,
  forgetPassword,
  verifyOtp,
  updatePassword,
  logout,
} = require("../controller/authcontroller");
const {
  userDetailById,
  allUsers,
  updateUser,
  userDetailByIdParams,deleteUser
} = require("../controller/userDetails");
const verifyToken = require("./verifyToken");

// const maxAge = 2*24*60*60;
// function createToken(id){

//     return jwt.sign({id},"Ankur"),{
//         expiresIn:maxAge
//     }

// }

router.post("/signup", signup);

router.post("/login", login);
router.post("/logout", logout);

router.get("/getUserById", verifyToken, userDetailById);
router.get("/getUserByIdParam/:id", verifyToken, userDetailByIdParams);

router.post("/forgetpassword", forgetPassword);
router.post("/verifyOtp", verifyOtp);
router.post("/reset-password", updatePassword);
router.get("/getAllUsers", allUsers),
  router.patch("/updateUser/:id", updateUser);
  router.delete('/deleteById/:id',deleteUser)


module.exports = router;
