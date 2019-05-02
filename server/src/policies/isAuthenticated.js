
const passport = require('passport')

module.exports = (req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if (err || !user) {
      res.status(401).send({
        error: 'usuário não está logado'
      })
    } else {
      req.user = user
      next()
    }
  })(req, res, next)
}
