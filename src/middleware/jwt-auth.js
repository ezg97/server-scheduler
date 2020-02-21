const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''

  let bearerToken
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: `Missing bearer token` })
  } else {
    bearerToken = authToken.slice(7, authToken.length)
  }

  try {
      console.log('about to verify')
    const payload = AuthService.verifyJwt(bearerToken)
    console.log('verified')

    AuthService.getUserWithUserName(
      req.app.get('db'),
      payload.sub,
    )
      .then(user => {
          console.log('made it 1')
          console.log('made it 2: ',user)
        if (!user)
          return res.status(401).json({ error: `1 Unauthorized request: ${user}` })

        req.user = user
        next()
      })
      .catch(err => {
        console.error(err)
        next(err)
      })
  } catch(error) {
    res.status(401).json({ error: `2 Unauthorized request: ` })
  }
}

module.exports = {
  requireAuth,
}