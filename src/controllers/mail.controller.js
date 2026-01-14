const sendMail = require("../config/mailer");

/**
 * RX SUBMISSION API
 * Accepts only multiple RX numbers
 */
exports.sendRxMail = async (req, res) => {
  try {
    const { rxNumbers } = req.body;

    if (!rxNumbers || !Array.isArray(rxNumbers) || rxNumbers.length === 0) {
      return res.status(400).json({ message: "Rx numbers are required" });
    }

    const mailContent = `
      <h2>New Prescription Submitted</h2>
      <p><strong>Rx Numbers:</strong></p>
      <ul>
        ${rxNumbers.map((rx) => `<li>${rx}</li>`).join("")}
      </ul>
      <p>Status: <strong>Prescription mail sent</strong></p>
    `;

    await sendMail({
      subject: "New Rx Submission",
      html: mailContent,
    });

    res.status(200).json({
      message: "Prescription mail sent successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send Rx mail" });
  }
};

/**
 * CONTACT FORM API
 */
exports.sendContactMail = async (req, res) => {
  try {
    const { firstName, lastName, email, inquiryType, message } = req.body;

    const mailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendMail({
      subject: "New Contact Inquiry",
      html: mailContent,
    });

    res.status(200).json({
      message: "Contact mail sent successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send contact mail" });
  }
};

/**
 * PRESCRIPTION TRANSFER API
 */
exports.sendTransferMail = async (req, res) => {
  try {
    const {
      patient,
      previousPharmacy,
      prescriptions,
      notes,
    } = req.body;

    if (!patient || !previousPharmacy || !prescriptions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const html = `
      <h2>Prescription Transfer Request</h2>

      <h3>Patient Details</h3>
      <p>
        <strong>Name:</strong> ${patient.firstName} ${patient.lastName}<br/>
        <strong>Phone:</strong> ${patient.phone}<br/>
        <strong>Date of Birth:</strong> ${patient.dob}
      </p>

      <h3>Previous Pharmacy Info</h3>
      <p>
        <strong>Pharmacy Name:</strong> ${previousPharmacy.name}<br/>
        <strong>Pharmacy Phone:</strong> ${previousPharmacy.phone}
      </p>

      <h3>Prescriptions</h3>
      <p>${prescriptions}</p>

      <h3>Notes</h3>
      <p>${notes || "N/A"}</p>
    `;

    await sendMail({
      subject: "Prescription Transfer Request",
      html,
    });

    res.status(200).json({
      message: "Prescription transfer request sent successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send transfer request" });
  }
};
