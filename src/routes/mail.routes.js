const express = require("express");
const router = express.Router();

const {
  sendRxMail,
  sendContactMail,
  sendTransferMail,
} = require("../controllers/mail.controller");

router.post("/rx", sendRxMail);
router.post("/contact", sendContactMail);
router.post("/transfer", sendTransferMail); // ✅ NEW

module.exports = router;
