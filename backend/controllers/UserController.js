const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// helpers
const createUserToken = require('../helpers/createUserToken')
const getToken = require('../helpers/getToken')
const getUserByToken = require('../helpers/getUserByToken')

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        // validations
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        }

        if(!email) {
            res.status(422).json({message: 'O e-mail é obrigatório!'})
            return
        }

        if(!phone) {
            res.status(422).json({message: 'O telefone é obrigatório!'})
            return
        }

        if(!password) {
            res.status(422).json({message: 'A senha é obrigatória!'})
            return
        }

        if(!confirmpassword) {
            res.status(422).json({message: 'A confirmação de senha é obrigatória!'})
            return
        }

        if(password !== confirmpassword) {
            res.status(422).json({message: 'A senha e confirmação de senha precisam ser iguais!'})
            return
        }

        // check if user exists
        const userExists = await User.findOne({email: email})

        if(userExists) {
            res.status(422).json({message: 'Esse e-mail já está registrado em nosso sistema, tente novamente com outro e-mail!'})
            return
        }

        // create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // crate a user
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save()
            
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({message: `Ocorreu um erro: ${error}`})
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        if(!email) {
            res.status(422).json({message: 'O e-mail é obrigatório!'})
            return
        }

        if(!password) {
            res.status(422).json({message: 'A senha é obrigatória!'})
            return
        }

        // check if user exists
        const user = await User.findOne({email: email})

        if(!user) {
            res.status(422).json({message: 'Nenhum usuário com este e-mail foi encontrado em nosso sistema, tente novamente!'})
            return
        }

        // check if passoword match
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({message: 'Senha incorreta, tente novamente!'})
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {
        let currentUser

        if(req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined
        } else {
            currentUser = null
        }
        
        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findById(id).select("-password") // remove o campo password do user no retorno

        if(!user) {
            res.status(422).json({message: 'Usuário não encontrado!'})
            return
        }

        res.status(200).json({ user: user })
    }

    static async editUser(req, res) {
        const id = req.params.id

        // check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const {name, email, phone, password, confirmpassword} = req.body

        if (req.file) {
            user.image = req.file.filename
        }

        // validations
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        }

        if(!email) {
            res.status(422).json({message: 'O e-mail é obrigatório!'})
            return
        }

        // check if email has already taken
        const userExists = await User.findOne({email: email})
        
        if (user.email !== email && userExists) {
            res.status(422).json({message: 'Esse e-mail já está sendo utilizado, tente novamente com outro e-mail!'})
            return
        }

        user.email = email

        if(!phone) {
            res.status(422).json({message: 'O telefone é obrigatório!'})
            return
        }

        user.phone = phone

        if(password !== confirmpassword) {
            res.status(422).json({message: 'A senha e confirmação de senha precisam ser iguais!'})
            return
        } else if(password === confirmpassword && password != null) {
            // creating new password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }
        
        try {
            // return user updated data
            await User.findOneAndUpdate(
                {_id: user._id},
                {$set: user},
                {new: true},
            )
            
            res.status(200).json({message: "Usuário atualizado com sucesso!"})
        } catch (error) {
            res.status(500).json({message: `Aconteceu um erro: ${error}`})
            return
        }
    }
}