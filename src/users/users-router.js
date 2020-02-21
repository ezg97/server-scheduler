const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, /*full_name, nickname*/ } = req.body

    for (const field of [/*'full_name',*/ 'user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    // TODO: check user_name doesn't start with spaces

    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    console.log('bout to check if username exists: ',user_name)
    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        console.log("Done checking: ", hasUserWithUserName)
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        console.log("IT does NOT exist")
        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              "business_name": user_name,
              "business_password": hashedPassword,
              /*full_name,
              nnickname,
              date_created: 'now()',*/
            }
            console.log('password hashed: ', newUser)
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                  console.log("success")
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

module.exports = usersRouter