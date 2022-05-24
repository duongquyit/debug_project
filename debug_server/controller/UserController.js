const User = require('../model/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const jwt = require('jsonwebtoken');

class UserController {
    // [POST] /signup
    async signUp(req, res) {
        try {
            const { name, username, password, email, address, phone, gender, isAdmin } = req.body;
            const user = await User.findOne({ username: username });
            if (!user) {
                if (!username) {
                    return res.status(404).send({ title: 'Username is required' });
                }
                if (name && username && password && email && gender) {
                    if (username.length < 6) {
                        return res.status(403).json({ message: 'Username must be at least 6 characters' });
                    }
                    if (password.length < 6) {
                        return res.status(403).json({ message: 'Password must be at least 6 characters' });
                    }
                    const user = new User({
                        name: name,
                        username: username,
                        password: await bcrypt.hash(password, saltRounds),
                        email: email,
                        address: address,
                        phone: phone,
                        gender: gender,
                        isAdmin: isAdmin,
                    });
                    await user.save();
                    return res.status(200).json(user);
                }
            }
            return res.status(404).json({ title: 'username is exists!' });
        } catch (error) {
            return res.status(404).json({ title: error })
        }
    }

    // [POST] /signin
    async signIn(req, res) {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!req.body.username) {
                return res.status(401).json({ title: 'Username not empty' })
            } else if (!req.body.password) {
                return res.status(401).json({ title: 'Password not empty' })
            }
            if (user) {
                if (user.isActive) {
                    if (await bcrypt.compare(req.body.password, user.password)) {
                        const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET, /*{ expiresIn: '1h' }*/);
                        return res.status(200).json(accessToken);
                    }
                    return res.status(401).json({ title: 'Password is wrong!' });
                }
                return res.status(401).json({ title: 'User not active!' });
            }
            return res.status(401).json({ title: 'Username not exist!' });
        } catch (error) {
            return res.status(402).json({ title: 'Error' })
        }
    }

    // [GET] /user
    async getUserInfor(req, res) {
        const userId = req.payload.id;
        try {
            const user = await User.findById(userId)
                .populate({ path: 'courses' })
                .populate({ path: 'blogs' })
            delete user.password;
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ title: 'Can not get user', error: error.message });
        }
    }

    // [GET] /user/:id
    async getUserById(req, res) {
        const id = req.params.id;
        try {
            const user = await User.findById(id);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ title: 'User can not found', error: error.message });
        }
    }

    // [PATCH] /user/update
    async updateUser(req, res) {
        const userId = req.payload.id;
        try {
            const { name, email, address, phone, gender, avatar } = req.body;
            const user = { name, email, address, phone, gender, avatar };
            await User.findOneAndUpdate({ _id: userId }, user);
            const userAfterUpdate = await User.findById(userId);
            return res.status(201).json(userAfterUpdate);
        } catch (error) {
            return res.status(401).json({ title: error.message });
        }
    }

    // [PATCH] /user/:id/update
    async updateUserById(req, res) {
        const userId = req.params.id;
        try {
            const { name, email, address, phone, gender, avatar } = req.body;
            const user = { name, email, address, phone, gender, avatar };
            await User.findOneAndUpdate({ _id: userId }, user);
            const userAfterUpdate = await User.findById(userId);
            return res.status(201).json(userAfterUpdate);
        } catch (error) {
            return res.status(401).json({ title: error.message });
        }
    }

    // [PATCH] /user/change-password
    async changePassword(req, res) {
        const userId = req.payload.id;
        const { oldPassword, newPassword, newPasswordConfirm } = req.body;
        if (!oldPassword) {
            return res.status(401).json({ title: 'Old password is required!' });
        } else if (!newPassword) {
            return res.status(401).json({ title: 'New password is required!' });
        } else if (!newPasswordConfirm) {
            return res.status(401).json({ title: 'New password confirm is required!' });
        }
        try {
            const user = await User.findById(userId);
            const check = await bcrypt.compare(oldPassword, user.password);
            if (check) {
                if (newPassword == newPasswordConfirm) {
                    await User.findByIdAndUpdate(userId, { password: await bcrypt.hash(newPassword, saltRounds) })
                    return res.status(200).json({ title: 'Change password successfully!' });
                }
                return res.status(401).json({ title: 'Password confirm is incorrect!' });
            }
            return res.status(401).json({ title: 'Password wrong!' });
        } catch (error) {
            return res.status(401).json({ title: error.message });
        }
    }

    // [PATCH] /user/:id/change-active
    async changeActiveStatus(req, res) {
        try {
            const user = await User.findById(req.params.id);
            user.isActive = !user.isActive;
            await user.save();
            return res.status(200).json({ title: 'Change active status!' });
        } catch (error) {
            return res.status(400).json({ title: 'Can not change active status!' });
        }
    }

    // [GET] /users
    async getUsers(req, res) {
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (error) {
            return res.status(401).json({ title: error.message })
        }
    }
}


module.exports = new UserController();