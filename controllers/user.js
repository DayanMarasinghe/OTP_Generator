import Login from '../models/Login.js';
import Student from '../models/Student.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

let otp;

/**
 * @description Login user
 * @param req
 * @param res
 * @param next
 */
export const login = (req, res, next) => {
    const {username, password, otp} = req.body;
    if (otp !== this.otp) {
        res.status(401).json({
            message: 'Invalid OTP',
        })
    }
    Login.findOne({username: username}, (err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        if (!user) {
            return res.status(404).send({message: "User Not found."});
        }
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        var token = jwt.sign({id: user.id}, "secret", {
            expiresIn: 86400 // 24 hours
        });
        res.status(200).send({
            id: user._id,
            username: user.username,
            role: user.role,
            accessToken: token
        });
    });

}

/**
 * @description Register user
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const register = async (req, res, next) => {
    const {
        name,
        username,
        contactNumber,
        password,
        otp
    } = req.body

    if (otp !== this.otp) {
        res.status(401).json({
            message: 'Invalid OTP',
        })
    }

    try {
        const hashedPw = await bcrypt.hash(password, 12)

        const student = new Student({
            name,
            contactNumber,
            username
        })

        const login = new Login({
            username,
            password: hashedPw,
            type: 'student',
            student: student._id,
        })
        const studentResult = await student.save()
        const loginResult = await login.save()

        const createdStudent = await Student.findById(
            studentResult._id
        ).populate('login')
        createdStudent.login = loginResult._id
        createdStudent.save()

        res.status(201).json({
            message: 'Student signup successfully!',
            userId: studentResult._id,
        })
    } catch (err) {
        res.status(500).json({
            error:err.message
        })
    }
}

/***
 * @description Reset password
 * @param req
 * @param res
 * @param next
 */
export const resetPasswords = (req, res,next) => {
    const {username, password, } = req.body;

    Login.findOne({username: username}, (err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        if (!user) {
            return res.status(404).send({message: "User Not found."});
        }
        var passwordIsValid = bcrypt.compareSync(
            password,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        var token = jwt.sign({id: user.id}, "secret", {
            expiresIn: 86400 // 24 hours
        });
        res.status(200).send({
            id: user._id,
            username: user.username,
            accessToken: token
        });
    });

}

/**
 * @description Create new functionality for the program that allows an administrator to allocate registered users to one of 2 roles.
 */

export const addRole = async (req, res, next) => {
    const {username, role} = req.body
    try {
        const user = await Login.findOne({username: username})
        if (!user) {
            res.status(404).json({
                message: 'User not found',
            })
        }
        user.role = role
        await user.save()
        res.status(200).json({
            message: 'User role added successfully',
        })
    } catch (err) {
        res.status(500).json({
            error: err.message,
        })
    }
}

/**
 * @description Send OTP to user
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const sendOTP = async (req, res, next) => {
    const {email} = req.body
    otp = Math.floor(100000 + Math.random() * 900000)
    const subject = 'OTP for password reset'
    const text = `Your OTP is ${otp}`
    try {
        await sendMail(email, subject, text)
        res.status(200).json({
            message: 'OTP sent successfully',
            otp: otp,
        })
    } catch (err) {
        res.status(500).json({
            error: err.message,
        })
    }
}

/**
 * @description send emails
 * @param email
 * @param subject
 * @param text
 * @returns {Promise<void>}
 */
const sendMail = async (email, subject, text) => {
    try {
        await mailer.sendMail({
            from: 'yasith@gmail.com',
            to: email,
            subject: subject,
            text: text,
        })
    } catch (err) {
        throw new Error(err)
    }
}