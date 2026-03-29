const { getAuth, clerkClient } = require('@clerk/express');

/**
 * Dozvoljava samo korisnike sa publicMetadata.role === 'admin' u Clerk-u.
 */
async function isAdmin(req, res, next) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Neautorizovan' });
    }

    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata?.role === 'admin') {
      return next();
    }

    return res.status(403).json({ error: 'Forbidden' });
  } catch (err) {
    console.error('Upload greška:', err);
    next(err);
  }
}

module.exports = isAdmin;
