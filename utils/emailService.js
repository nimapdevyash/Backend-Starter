/* eslint-disable max-len */
const { emailEnqueValidation } = require("../src/validators/commonValidators");
const constants = require("./constants");

const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const commonFunctions = require('./commonFunctions');
const { EMAIL } = require('./constants');
const model = require('../src/models');

const mailQueue = [];
let bulkMailIntervalId = null;

const transporter = nodemailer.createTransport({
  host: EMAIL.HOST,
  port: EMAIL.PORT,
  secure: EMAIL.ISSECURE,
  auth: {
    user: EMAIL.USER,
    pass: EMAIL.PASSWORD
  },
});

async function getFileSize(filepath) {
  try {
    const stats = await fs.stat(filepath);
    if (!stats.isFile()) {
      throw new Error('Path is not a file');
    }
    return stats.size / (1024 * 1024);
  } catch (error) {
    throw new Error('Failed to get file size', error);
  }
};

function getContentType(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.csv': 'text/csv',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

const sendEmail = async ({
  to,
  subject,
  html,
  filepath = null,
}) => {
  const recipients = Array.isArray(to) ? to : [to];
  if (
    !recipients.length ||
    recipients.some((email) => !email || !/\S+@\S+\.\S+/.test(email)) ||
    !subject ||
    !html
  ) {
    throw new Error(
      "Valid recipient(s), subject, and HTML content are required"
    );
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.length === 1 ? recipients[0] : recipients,
      subject,
      html,
    };

    if (filepath) {
      const fileSize = await getFileSize(filepath);
      if (fileSize > 20) {
        throw new Error("File size exceeds 20MB limit");
      }
      mailOptions.attachments = [
        {
          filename: path.basename(filepath),
          path: filepath,
          contentType: getContentType(filepath),
        },
      ];
    }

    await transporter.sendMail(mailOptions);
    return {
      status: "success",
      message: `Email sent successfully to ${recipients.join(", ")}`,
    };
  } catch (error) {
    const errorInfo = {
      to: recipients.join(", "),
      subject,
      errorMessage: error.message,
      stackTrace: error.stack,
    };

    try {
      await commonFunctions.create(model.emailLogs, errorInfo);
    } catch (logError) {
      console.error("Failed to log email error to DB:", logError.message);
    }
    throw new Error(
      `Failed to send email to ${recipients.join(", ")}: ${error.message}`
    );
  }
};

sendBulkMail = async () => {
  if (!mailQueue.length) return;

  const batchSize = constants.BulkMailBatchSize ;
  const mailsToSend = mailQueue.splice(0, batchSize);

  await Promise.all(
    mailsToSend.map(async (mailInfo) => {
      try {
        await sendEmail(mailInfo);
      } catch (err) {
        console.error("Failed to send email:", mailInfo, err);

        // push back to queue for retry
        mailQueue.push(mailInfo);
      }
    })
  );
};

// ------------------------ expose only services and not the whole functionality ------------------------

// verify and schedule the emails to sent appropriatelly
exports.enqueueEmail = async ({to , html , subject , filepath }) => {
  await emailEnqueValidation.validateAsync({to , html , subject , filepath});
  mailQueue.push({ to, html, subject, filepath});
};

exports.startBulkMailService = () => {
  if (bulkMailIntervalId) return; 
  bulkMailIntervalId = setInterval(() => {
    exports.sendBulkMail();
  }, constants.BulkMailBufferInterval);
};

exports.stopBulkMailService = () => {
  if (bulkMailIntervalId) {
    clearInterval(bulkMailIntervalId);
    bulkMailIntervalId = null;
  }
};