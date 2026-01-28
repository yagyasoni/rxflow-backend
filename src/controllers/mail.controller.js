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
    const { patient, previousPharmacy, prescriptions, notes } = req.body;

    /* -------------------- 1. REQUIRED field check -------------------- */
    if (!patient || !previousPharmacy) {
      return res.status(400).json({
        message: "Missing required fields: patient and previousPharmacy",
      });
    }

    /* -------------------- 2. Validate patient subfields -------------------- */
    const { firstName, lastName, phone, dob } = patient;

    if (!firstName || !lastName || !phone || !dob) {
      return res.status(400).json({
        message: "Missing patient subfields",
      });
    }

    /* -------------------- 3. Validate previousPharmacy subfields -------------------- */
    const { name, address } = previousPharmacy;

    if (!name || !address) {
      return res.status(400).json({
        message: "Missing previousPharmacy subfields",
      });
    }

    /* -------------------- 4. OPTIONAL: Validate prescriptions -------------------- */
    if (prescriptions) {
      if (!Array.isArray(prescriptions)) {
        return res.status(400).json({
          message: "Prescriptions must be an array",
        });
      }

      for (const rx of prescriptions) {
        const { name, rxnumber } = rx || {};

        if (!name || !rxnumber) {
          return res.status(400).json({
            message: "Each prescription must have name and rxnumber",
          });
        }
      }
    }

    /* -------------------- 5. Generate Email HTML -------------------- */
    const html = `
      <h2>Prescription Transfer Request</h2>

      <h3>Patient Details</h3>
      <p>
        <strong>Name:</strong> ${firstName} ${lastName}<br/>
        <strong>Phone:</strong> ${phone}<br/>
        <strong>Date of Birth:</strong> ${dob}
      </p>

      <h3>Previous Pharmacy Info</h3>
      <p>
        <strong>Pharmacy Name:</strong> ${name}<br/>
        <strong>Pharmacy Address:</strong> ${address}
      </p>

      ${prescriptions && prescriptions.length > 0 ? `
        <h3>Prescriptions</h3>
        <ul>
          ${prescriptions
            .map(
              rx => `
                <li>
                  <strong>Drug/Name:</strong> ${rx.name} |
                  <strong>Rx Number:</strong> ${rx.rxnumber}
                </li>
              `
            )
            .join("")}
        </ul>
      ` : ''}

      <h3>Notes</h3>
      <p>${notes || "N/A"}</p>
    `;

    await sendMail({
      subject: "Prescription Transfer Request",
      html,
    });

    return res.status(200).json({
      message: "Prescription transfer request sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to send transfer request",
    });
  }
};


/* ======================================================
   MEDICATION AVAILABILITY API
   ====================================================== */
exports.sendMedicationAvailabilityMail = async (req, res) => {
  try {
    const { medicationName, firstName, lastName, dob, phone, email, consent } = req.body;

    if (!medicationName || !firstName || !lastName || !phone) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #059669;">Medication Availability Request</h2>
        <p><strong>Medication:</strong> <span style="font-size: 1.2em;">${medicationName}</span></p>
        <hr/>
        <h3>Patient Information</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>DOB:</strong> ${dob || "N/A"}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "N/A"}</p>
        <p><strong>Consent Provided:</strong> ${consent ? "Yes" : "No"}</p>
      </div>
    `;

    await sendMail({
      subject: `Availability Inquiry: ${medicationName}`,
      html,
    });

    res.status(200).json({ message: "Availability request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send availability request" });
  }
};

/* ======================================================
   SAVINGS & COPAY REQUEST API
   ====================================================== */
exports.sendSavingsRequestMail = async (req, res) => {
  try {
    // Destructure data from req.body (Multer populates this)
    const {
      firstName,
      lastName,
      dob,
      phone,
      medicationName,
      strength,
      insuranceStatus,
      expensiveElsewhere,
      currentPharmacy,
      approximatePrice,
      consent,
    } = req.body;

    // Build Email HTML
    const html = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #059669;">Savings & Copay Assistance Request</h2>
        <p><strong>Medication:</strong> ${medicationName} ${strength || ""}</p>
        <hr />
        <h3>Patient Info</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}<br/>
           <strong>DOB:</strong> ${dob}<br/>
           <strong>Phone:</strong> ${phone}</p>
        
        <h3>Insurance & Cost</h3>
        <p><strong>Status:</strong> ${insuranceStatus}<br/>
           <strong>Expensive at other pharmacy:</strong> ${expensiveElsewhere}</p>
        
        <h3>Optional Info</h3>
        <p><strong>Current Pharmacy:</strong> ${currentPharmacy || "N/A"}<br/>
           <strong>Price Paid/Quoted:</strong> ${approximatePrice || "N/A"}</p>
        <p><strong>Consent Given:</strong> ${consent ? "Yes" : "No"}</p>
      </div>
    `;

    const mailOptions = {
      subject: `Savings Request: ${medicationName} - ${firstName} ${lastName}`,
      html,
      attachments: [],
    };

    // If a file was uploaded via Multer, attach it
    if (req.file) {
      mailOptions.attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer,
      });
    }

    await sendMail(mailOptions);
    res.status(200).json({ message: "Savings request sent successfully" });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: "Failed to send savings request" });
  }
};