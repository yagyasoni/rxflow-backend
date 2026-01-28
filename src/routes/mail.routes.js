const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Store in memory for immediate emailing

const {
  sendRxMail,
  sendContactMail,
  sendTransferMail,
  sendMedicationAvailabilityMail,
  sendSavingsRequestMail,
} = require("../controllers/mail.controller");

router.post("/rx", sendRxMail);
router.post("/contact", sendContactMail);
router.post("/transfer", sendTransferMail);
router.post("/medication-availability", sendMedicationAvailabilityMail);

// Added upload.single('insuranceCard') to catch the file from the frontend
router.post("/savings-request", upload.single('insuranceCard'), sendSavingsRequestMail);

module.exports = router;