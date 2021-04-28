const enquiryController = require("../controller/enquiry.controller");
const express = require("express");

const router = express.Router();

router.post(
  '/save',
  enquiryController.validate("saveEnquiry"),
  enquiryController.saveEnquiry
);

router.post('/all', enquiryController.fetchAll);
router.post('/get', enquiryController.validate("fetchEnquiry"), enquiryController.fetchEnquiry);
router.post('/details', enquiryController.fetchEnquiryWithDetails);


module.exports = router;
