// server/utils/auditLogger.js
const AuditLog = require('../models/AuditLog');

const logAction = async ({ user, action, target, metadata }) => {
  try {
    const logEntry = new AuditLog({
      userId: user ? user.id : null,
      userName: user ? user.name : 'System',
      userRole: user ? user.role : 'system',
      action,
      target,
      metadata
    });
    await logEntry.save();
  } catch (error) {
    console.error('Failed to save audit log:', error);
  }
};

module.exports = logAction;
