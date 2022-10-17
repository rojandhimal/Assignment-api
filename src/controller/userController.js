const { User } = require("../models");

// TO GET ALL USERS
module.exports.apiGetAllUsers = async (req, res) => {
    const { search , sort} = req.query;
    let queryOptions = {};
    //For search
    if (search) {
        queryOptions = {
            $or: [
                { name: new RegExp(search, 'i') },
                { slug: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
            ]
        };
    }
    let resultsPerPage = req?.query?.page || 10;;
    let skipCount = 0;
    let page = 1;
    let sortOptions = {};
    if (req.query.page) {
        page = parseInt(req.query.page)
    }
    skipCount = (page * resultsPerPage) - resultsPerPage;
    if (sort) {
        if (sort == "latest") {
            sortOptions.createdAt = -1;
        } else if (sort == "oldest") {
            sortOptions.createdAt = 1;
        }
    } else {
        sortOptions.createdAt = -1;
    }
    User.find(queryOptions)
        .sort(sortOptions)
        .limit(resultsPerPage)
        .skip(skipCount)
        .then((users) => {
            User.find(queryOptions)
                .countDocuments()
                .then((count) => {
                    return res.status(200).send({
                        resultsPerPage,
                        currentPage: page,
                        totalPage: Math.ceil(count / resultsPerPage),
                        totalDocuments: count,
                        users,
                    });
                })
                .catch((error) => {
                    return res.status(500).send({
                        status: "error",
                        message: error.message,
                    });
                })
        })
        .catch((error) => {
            let failure = {
                success: false,
                message: "Error",
                error,
            };
            return res.status(400).send(failure);
        });
}

// TO GET USER BY USER-ID
module.exports.apiGetUserbyId = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password').populate('role', 'name');
    if (user) {
        return res.json({ status: "success", user });
    }
    return res.status(404).json({ status: false, message: 'User not found' });
}

// TO CREATE USER
module.exports.apiCreateUser = async (req, res) => {
    // FOR PROFILE PICTURE
    const { number, email } = req.body;
    if (req.file)
        req.body.profile = req.file.filename;

    User.findOne({ email }).then((user) => {
        if (user) {
            return res.status(400).json({ "status": "Failure", message: `User with email: ${email} already exist` })
        } else {
            User.create(req.body).then((user) => {
                return res.status(201).json({ status: true, user, message: 'User created successfully' });
            })
                .catch((error) => {
                    return res.status(400).json({ "status": "Failure", message: error })
                })
        }
    }).catch((error) => {
        return res.status(400).json({ "status": "Failure", message: error })
    })
}

// TO UPDATE USER BY USER_ID
module.exports.apiUpdateUser = (req, res) => {
    const { id: userId } = req.params;
    if (req.body.password) {
        delete req.body.password;
    }

    User.findById(userId).then((user) => {
        if (user) {
            user.updateOne(req.body, { new: true }).then((user_new) => {
                res.status(200).json({ "status": "success", message: "User updated sucessfully", user: user_new })
            }).catch((error) => {
                return res
                    .status(400)
                    .json({ status: "error", message: error.message });
            });
        } else {
            res.status(400).json({ "status": "failure", message: "User not found" })
        }
    }).catch((error) => {
        return res
            .status(400)
            .json({ status: "error", message: error.message });
    });
}


// TO UPDATE USER Password BY USER_ID
module.exports.apiUpdatePassword = async (req, res) => {
   let user = await User.findById(req.user.id);
    if (user) {
        const isValidOldPassword = await user.checkPassword(req.body.oldPassword);
        if (isValidOldPassword) {
            const password = await user.hashPassword(req.body.password);
            user = await User.findByIdAndUpdate(user._id, { password });
            await UserHistory.create({ historyType: 'password-change', user: req.user.id });
            user = await User.findById(user._id).select('-password').populate('role', 'name');
            return res.json({ status: true, user, message: "Password updated successfully" });
        }
        return res.status(400).json({ status: false, message: "Old password doesn't matched" });
    }
    return res.status(404).json({ status: false, message: 'User not found' });
}

// TO DELETE USER BY USER_ID
module.exports.apiDeleteUser = async (req, res) => {
    const { id: userId } = req.params;
    const user = await User.findById(userId);
    if (user) {
        await User.deleteOne(userId).then(() => {
            return res.json({ status: true, message: "User deleted successfully" });
        }).catch((error) => {
            return res.json({ status: true, message: error?.message });
        })
    }
    else
        return res.status(404).json({ status: false, message: 'User not found' });
}
