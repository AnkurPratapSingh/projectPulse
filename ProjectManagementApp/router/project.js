const express = require("express");
const router = express.Router();
const {addProject, projectDetailsBrief, allProjectDetail, projectDetailById, updateProject, deleteProject, projectStatus} = require('../controller/projectscontroller')
const {userDetailById} = require('../controller/userDetails')
const verifyToken = require('./verifyToken');



router.post('/addproject', addProject);
router.put('/updateproject', updateProject);

router.get('/projectBriefData',projectDetailsBrief)
router.get('/allprojectdetail',allProjectDetail)
router.get('/projectById/:id',projectDetailById)
router.delete('/deleteById/:id',deleteProject)
router.get('/projectstatus/:id',projectStatus)


module.exports = router;
