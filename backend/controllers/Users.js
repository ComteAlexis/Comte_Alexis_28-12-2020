const db = require('../admin/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_KEY)
const verify = require('../function/verify')
const fs = require('fs')

exports.connectUser = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(500).json({ error: 'Veuillez entrer des informations correct.' })
  } else{
    db.query('SELECT * FROM Users WHERE email = ? LIMIT 1', [req.body.email])
      .then(users => {
        if (users.length === 1) {
          bcrypt.compare(req.body.password, users[0].password)
            .then(success => {
              if (success) {
                const jsonToken = jwt.sign({ userId: users[0].id, role: users[0].role }, process.env.JWT_SECRET, { expiresIn: '24h' })
                res.status(200).json({ success: true, token: jsonToken })
              } else {
                res.status(400).json({ error: 'Le mot de passe ne correspond pas à celui enregistré.' })
              }
            })
            .catch(error => res.status(500).json({ error }))
        } else {
          res.status(400).json({ error: 'Votre compte n\'éxiste pas.' })
        }
      })
      .catch(error => res.status(500).json({ error }))
  }
}

exports.createUser = (req, res, next) => {
  if (!req.body.password || !req.body.passVerif || !req.body.lastname || !req.body.firstname || !req.body.email) {
    res.status(500).json({ error: 'Au moins un des champs n\'a pas été remplie.' })
  }
  else if (req.body.password !== req.body.passVerif) {
    res.status(500).json({ error: 'Les mots de passe données ne sont pas identique.' })
  }
  else{
    const errorForm = {}
    let formValid = true

    if (!verify.email(req.body.email)) {
      errorForm['email'] = 'Veuillez saisir une adresse email valide.'
      formValid = false
    }
    if (!verify.password(req.body.password)) {
      errorForm['password'] = 'Votre mot de passe doit contenir au moin une majusucle et minuscule, un chiffre ainsi qu\'un caractère spécial.'
      formValid = false
    }

    if (formValid) {
      db.query('SELECT * FROM Users WHERE email = ?', [req.body.email])
      .then(result => {
        if (result.length === 0) {
          bcrypt.hash(req.body.password, 10)
            .then(password => {
              db.query('INSERT INTO Users (lastname, firstname, password, email) VALUES (?, ?, ?, ?)', [req.body.lastname, req.body.firstname, password, req.body.email])
                .then(result => {
                  res.status(201).json({ message: 'User created with success' })
                })
                .catch(error => res.status(500).json({ error }))
            })
            .catch(error => res.status(500).json({ error }))
        } else {
          res.status(500).json({ error: 'Email déjà utilisé.' })
        }
      })
      .catch(error => res.status(500).json({ error }))
    } else {
      res.status(400).json({ error: 'Veuillez vérifier votre formulaire', errorForm })
    }
  }
}

exports.updateUser = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const userId = decodedToken.userId

  if(!req.body.info && !req.file) {
    res.status(500).json({message: 'Problème avec le server'})
    return
  }

  if(req.body.info) {
    const {lastname, firstname, email} = {...req.body.info}

    if (!lastname || !firstname || !email) {
      res.status(400).json({message: 'Aucun champ ne doit être vide'})
      return
    }

    if (!verify.email(email)) {
      res.status(400).json({message: 'L\'email n\'est pas valide'})
      return
    }
    db.query('UPDATE Users SET lastname = ?, firstname = ?, email = ? WHERE id = ?', [lastname, firstname, email, userId])
      .then(result => res.status(200).json({message: 'User updated'}))
  } else if (req.file) {
    db.query('SELECT avatar_url FROM Users WHERE id = ? LIMIT 1', [userId])
      .then(result => {
        avatarUrl = result[0].avatar_url
        if(avatarUrl === 'default.jpg') {
          db.query('UPDATE Users SET avatar_url = ? WHERE id = ?', [req.file.filename, userId])
            .then(result => res.status(201).json({message: 'image update'}))
        } else {
          console.log(avatarUrl)
          fs.unlink(`images/avatar/${avatarUrl}`, () => {
            db.query('UPDATE Users SET avatar_url = ? WHERE id = ?', [req.file.filename, userId])
              .then(result => res.status(201).json({message: 'image update'}))
          })
        }
      })
      .catch(error => res.status(500).json({error}))
  }

  
}

exports.deleteUser = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const userId = decodedToken.userId
  if (parseInt(req.params.id, 10) === userId) {
    db.query('DELETE FROM Users WHERE id = ?', [parseInt(req.params.id, 10)])
      .then(res.status(200).json({ message: 'Utilisateur supprimé' }))
      .catch(error => res.status(500).json({ error }))
  } else {
    res.status(500).json({ error: 'Vous n\'avez pas les droits sur cet utilisateur' })
  }
}

exports.getMyInfo = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const userId = decodedToken.userId

  db.query('SELECT lastname, firstname, email, avatar_url FROM Users WHERE id = ?', [userId])
    .then(userInfo => res.status(200).json({userInfo}))
    .catch(error => res.status(500).json({error}))
}

exports.updatePassword = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const userId = decodedToken.userId

  if (!req.body.info) {
    res.status(500).json({message: 'Erreur Client'})
    return
  }

  if (!req.body.info.oldPass && !req.body.info.oldPass && !req.body.info.oldPass) {
    res.status(400).json({message: 'Aucun champ mot de passe ne doit être vide'})
    return
  }

  if (req.body.newPass !== req.body.newPassVerif) {
    res.status(400).json({message: 'Les 2 mots de passe ne sont pas identique'})
    return
  }

  if (req.body.info.newPass === req.body.info.oldPass) {
    res.status(400).json({ message: 'L\'ancien mot de passe ne peut pas être le même que le nouveau'})
    return 
  }

  db.query('SELECT password FROM Users WHERE id = ? LIMIT 1', [userId])
    .then(response => {
      bcrypt.compare(req.body.info.oldPass, response[0].password)
        .then(result => {
          if(result) {

            if(!verify.password(req.body.info.newPass)) {
              res.status(400).json({message: 'Veuillez utiliser des minuscule majuscule et caractère spéciaux'})
            }

            bcrypt.hash(req.body.info.newPass, 10)
              .then(password => {
                db.query('UPDATE Users SET password = ? WHERE id = ?', [password, userId])
                  .then(result => res.status(200).json({message: 'Mot de passe mis à jour'}))
                  .catch(error => res.status(500).json({error}))
              })
          }
          else {
            res.status(500).json({message: 'Erreur de mot de passe'})
          }
        })
        .catch(error => res.status(500).json({error}))
    })
    .catch(error => res.status(500).json({error}))
}