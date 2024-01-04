const express = require("express");
const connection = require("../connection");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();
const otpGenerator = require("otp-generator");

const maxAge = 2 * 24 * 60 * 60;
function createToken(id) {
  return jwt.sign({ id }, "Ankur", {
    expiresIn: maxAge,
  });
}

// const signup = async (req, res) => {
//   const { username, email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
//   const user = { username, email, password };
      
//   const query =
//     "INSERT INTO Users(username, email, password) VALUES (?, ?, ?);";

//   try {
//     connection.query(
//       query,
//       [username, email, hashedPassword],
//       async (err, result) => {
//         if (err) {
//            throw err
//         } else {
//           console.log(result);
//           res.status(200).send("Signed up successfully");
//         }
//       }
//     );
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// };

const signup = async (req, res) => {
    const { username, email, password ,role} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  
    const checkQuery = "SELECT * FROM Users WHERE email = ?;";
    const insertQuery = "INSERT INTO Users (username, email, password,role) VALUES (?, ?, ?,?);";
  
    try {
      connection.query(checkQuery, [email], async (err, results) => {
        if (err) {
          throw err;
        }
  
        if (results.length > 0) {
          res.status(400).send("Email already exists"); // Email already in use
        } else {
          connection.query(insertQuery, [username, email, hashedPassword,role], async (err, result) => {
            if (err) {
              throw err;
            } else {
              console.log(result);
              res.status(200).send("Signed up successfully");
            }
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error signing up");
    }
  };
  

const login = (req, res) => {
  const { email, password } = req.body;
  const query =
    "SELECT user_id,username,role,password FROM Users WHERE email = ? ";
  try {
    connection.query(query, [email], async (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        res.status(500).json({ error: "Server error" });
        return;
      }

      if (results.length > 0) {
        const validPassword = await bcrypt.compare(
          password,
          results[0].password
        );
        if (!validPassword) {
          return res.status(401).send("Invalid email or password");
        }
        const token = createToken(results[0].user_id,results[0].role);
        // const userData = {
        //     user_id:result[0].user_id,
        //     email:results[0].email,
        //     username:result.
        // }
        // Successful login

        //Session Table
        const sessionQuery = "INSERT INTO Session(user_id , isActive) VALUES (?, TRUE) ON DUPLICATE KEY UPDATE isActive = TRUE;";


        // const sessionQuery = "UPDATE  Session SET isActive = TRUE WHERE user_id = ?";
        try{
            connection.query(sessionQuery,[results[0].user_id],(err,result)=>{
                if (err) {
                   throw err;
                   
                  }
                  else{
                    res
                    .status(200)
                    .json({ message: "Login successful", token, user: results[0] });
                  }

            })
        }
        catch(err){
            console.error("Error querying database:", err);
            res.status(500).json({ error: "Server error" });

        }
        
      } else {
        // Invalid credentials
        res.status(401).json({ error: "Invalid email or password" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up");
  }
};

const forgetPassword = async (req, res) => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  console.log(otp);
  const email = req.body.email;
  const query =
    "INSERT INTO Otps(email, otp) VALUES (?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp);";

  try {
    connection.query(query, [email, otp], async (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error otp");
      } else {
        console.log(result);
        res.status(200).send("otp save successfully");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("invalid email");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: otp, // plain text body
    html: `<b>Hello world?${otp}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

const verifyOtp = (req, res) => {
  try {
    const otp = req.body.otp;
    const email = req.body.email
    const query = "select otp from Otps where email =?";

    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      } else {
        console.log(results[0].otp);
        if (results.length > 0 && otp ===results[0].otp) {

          //res.json(results[0]);
          res.json({ success: true, message: "otp verified" });
        } else {
          res.status(400).json({ message: "Invalid OTP" });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePassword = async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

      const query = 'UPDATE Users SET password = ? WHERE email = ?';
  
      await connection.query(query, [hashedPassword, email], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          if (results.affectedRows > 0) {
            res.json({ success: true, message: 'Password updated successfully' });
          } else {
            res.status(404).json({ message: 'User not found' });
          }
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  //LOGOUT

  const logout = async(req,res)=>{
    try{
        const userId   = req.body.user_id;
        console.log(userId);
       const sessionQuery = "UPDATE  Session SET isActive = False WHERE user_id = ?";
       connection.query(sessionQuery,[userId],(err,results)=>{
            if(err) throw err;
            else{
                res.json({message:'LoggedOut Succesfully'})
            }
       })


    }
    catch(err){
        res.status(500).json({message:'Internal Server Error'})

    }
  }
module.exports = { signup, login, forgetPassword, verifyOtp,updatePassword ,logout};
