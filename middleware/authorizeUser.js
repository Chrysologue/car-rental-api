// middleware/authorizeUser.js
function authorizeUserOrAdmin(req, res, next) {
  const loggedInUserId = req.user?.id;
  const targetUserId = req.params.id;

  // Allow admins
  if (req.user?.role === 'admin') return next();

  if (loggedInUserId && loggedInUserId === targetUserId) {
    return next();
  }

  return res
    .status(403)
    .json({ error: 'You are not allowed to perform this action' });
}

module.exports = authorizeUserOrAdmin;
