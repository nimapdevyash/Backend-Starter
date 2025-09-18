/* eslint-disable max-len */
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs").promises;

const { emailEnqueValidation } = require("../src/validators/commonValidators");
const { CONSTANTS } = require("./constants");
const { create } = require("./dbOperations");
const model = require("../src/models");

// ---------------- CONFIG ----------------
const MAX_FILE_SIZE_MB = CONSTANTS.EMAIL.MAX_FILE_SIZE_MB;
const MAX_RETRY_ATTEMPTS = CONSTANTS.EMAIL.MAX_RETRY_ATTEMPTS;

// ---------------- STATE ----------------
const mailQueue = [];
let bulkMailIntervalId = null;

const transporter = nodemailer.createTransport({
  host: CONSTANTS.EMAIL.HOST,
  port: CONSTANTS.EMAIL.PORT,
  secure: CONSTANTS.EMAIL.ISSECURE,
  auth: {
    user: CONSTANTS.EMAIL.USER,
    pass: CONSTANTS.EMAIL.PASSWORD,
  },
});

// ---------------- HELPERS ----------------
async function getFileSizeMB(filepath) {
  const stats = await fs.stat(filepath);
  if (!stats.isFile()) throw new Error("Path is not a file");
  return stats.size / (1024 * 1024);
}

function getContentType(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  const mimeTypes = {
    ".pdf": "application/pdf",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".csv": "text/csv",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

async function logEmailError(info) {
  try {
    await create({ model: model.emailLogs, body: info });
  } catch (err) {
    console.error("Failed to log email error:", err.message);
  }
}

// ---------------- CORE ----------------
async function sendEmail({ to, subject, html, filepath = null }) {
  const recipients = Array.isArray(to) ? to : [to];
  const mailOptions = {
    from: CONSTANTS.EMAIL.USER,
    to: recipients.length === 1 ? recipients[0] : recipients,
    subject,
    html,
  };

  if (filepath) {
    const fileSize = await getFileSizeMB(filepath);
    if (fileSize > MAX_FILE_SIZE_MB) {
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

  try {
    await transporter.sendMail(mailOptions);
    return { status: "success", message: `Sent to ${recipients.join(", ")}` };
  } catch (error) {
    await logEmailError({
      to: recipients.join(", "),
      subject,
      errorMessage: error.message,
      stackTrace: error.stack,
    });
    throw error;
  }
}

async function processBatch() {
  if (!mailQueue.length) return;
  const batchSize = CONSTANTS.BULK_MAIL_BATCH_SIZE;

  const mailsToSend = mailQueue.splice(0, batchSize);

  await Promise.all(
    mailsToSend.map(async (mailInfo) => {
      try {
        await sendEmail(mailInfo);
      } catch (err) {
        if ((mailInfo.retryCount || 0) < MAX_RETRY_ATTEMPTS) {
          console.warn("Retrying failed email:", mailInfo.to, err.message);
          mailQueue.push({
            ...mailInfo,
            retryCount: (mailInfo.retryCount || 0) + 1,
          });
        } else {
          console.error("Dropping email after max retries:", mailInfo.to);
        }
      }
    })
  );
}

// ---------------- PUBLIC API ----------------
exports.enqueueEmail = async ({ to, html, subject, filepath }) => {
  await emailEnqueValidation.validateAsync({ to, html, subject, filepath });
  mailQueue.push({ to, html, subject, filepath, retryCount: 0 });
};

exports.startBulkMailService = () => {
  if (bulkMailIntervalId) return;
  transporter
    .verify()
    .then(() => {
      console.log("🚀 SMTP server is ready to send messages");
      bulkMailIntervalId = setInterval(
    processBatch,
    CONSTANTS.BULK_MAIL_BUFFER_INTERVAL
  );
    })
    .catch((err) => {
      console.error("SMTP config error:", err);
    });

  
};

exports.stopBulkMailService = async () => {
  if (bulkMailIntervalId) {
    clearInterval(bulkMailIntervalId);
    bulkMailIntervalId = null;
    // Optionally flush queue before shutdown
    if (mailQueue.length) await processBatch();
  }
};
