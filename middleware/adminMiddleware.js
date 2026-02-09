async function checkAdmin(req, res, next) {
  const isAdmin = req.user?.role === 'admin';
  console.log(req.user);
  console.group(req.user.role);
  if (!isAdmin) {
    return res.status(403).json({ error: 'Access denied. Admins only' });
  }
  next();
}

module.exports = { checkAdmin };