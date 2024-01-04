const express = require("express");
const connection = require("../connection");
const router = express.Router();
const verifyToken = require("./verifyToken");

const { allManager , myProjects, managerProjectBrief } = require('../controller/managerController')


router.get('/getManagers',verifyToken,allManager)
router.get('/getMyProjects',verifyToken,myProjects)
router.get('/projectbrief',verifyToken,managerProjectBrief)

module.exports = router;
