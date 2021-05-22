const bcrypt = require('bcrypt-nodejs')
const jwt = require('jwt-simple')
const { authSecret } = require('../.env')

module.exports = app => {

    getHash = (password, callback) => {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(password, salt, null, (error, salt) => callback(hash))
        })
    }

    const signup = (request, response) => {
        const password = request.body.password
        const name = request.body.name
        const email = request.body.email.toLowerCase()
        
        if(!password || !name || email) {
            return response.status(400).send('Dados incompletos!')
        }

        getHash(password), hash => {
            const hashPassword = hash
            app.db('users')
                .insert({
                    name: name,
                    email: email,
                    password: hashPassword
                })
                .then(_ => response.status(204).send())
                .catch(error => response.status(500).json(error))
        }
    }

    const signin = async (request, response) => {
        const name = request.body.name
        const email = request.body.email
        const password = request.body.password

        if(!email || !password) {
            return response.status(400).send('Dados incompletos!')
        }

        const user = await app.db('users')
            .whereRaw("LOWER(email) = LOWER(?)", email)
            .first()
            .catch(error => response.status(500).json(error))
        
        if(user) {
            bcrypt.compare(password, user.password, (error, isMatch) => {
                if(error || !isMatch) {
                    return response.status(401).send('Senha inválida!')
                }

                const userId = user.id
                const userName = user.name
                const userEmail = user.email

                const payload = {
                    id: userId,
                    name: userName,
                    email: userEmail
                }

                response.json({
                    name: userName,
                    email: userEmail,
                    token: jwt.encode(payload, authSecret)
                })
            })
        } else {
            response.status(400).send('Usuário inválido!')
        }
    }

    return {
        signup,
        signin
    }
}