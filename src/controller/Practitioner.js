const { Practitioner } = require("../models");

// TO GET ALL Practitioner
module.exports.apiGetAllPractitioners = async (req, res) => {
    const { search ,sort} = req.query;
    let queryOptions = {};
    //For search
    if (search){
        queryOptions = {
            $or: [
                { fullname: new RegExp(search, 'i') },
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

    Practitioner.find(queryOptions)
        .sort(sortOptions)
        .limit(resultsPerPage)
        .skip(skipCount)
        .then((practitioners) => {
            Practitioner.find(queryOptions)
                .countDocuments()
                .then((count) => {
                    return res.status(200).send({
                        resultsPerPage,
                        currentPage: page,
                        totalPage: Math.ceil(count / resultsPerPage),
                        totalDocuments: count,
                        practitioners,
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
module.exports.apiGetPractitionerbyId = async (req, res) => {
    const practitioner = await Practitioner.findById(req.params.id).populate('specialization', 'name');
    if (practitioner) {
        return res.json({ status: "success", practitioner });
    }
    return res.status(404).json({ status: false, message: 'Practitioner not found' });
}

// TO CREATE USER
module.exports.apiCreatePractitioner = async (req, res) => {
    const { code, number, email } = req.body;
    if (req.file)
        req.body.profile = req.file.filename;

    if (code && number) {
        req.body.phoneNumber = { code, number };
    }
    Practitioner.findOne({ email }).then((practitioner) => {
        if (practitioner) {
            return res.status(400).json({ "status": "Failure", message: `Practitioner with email: ${email} already exist` })
        } else {
            Practitioner.create(req.body).then((practitioner) => {
                return res.status(201).json({ status: true, practitioner, message: 'Practitioner created successfully' });
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
module.exports.apiUpdatePractitioner = (req, res) => {
    const { id: practitionerId } = req.params;
    Practitioner.findById(practitionerId).then((practitioner)=>{
        if(practitioner){
            practitioner.updateOne(req.body,{new:true}).then((practitioner_new)=>{
                res.status(200).json({"status":"success",message:"Practitioner updated sucessfully",practitioner:practitioner_new})
            }).catch((error) => {
                return res
                    .status(400)
                    .json({ status: "error", message: error.message });
            });
        }else{
            res.status(400).json({"status":"failure",message:"Practitioner not found"})
        }
    }).catch((error) => {
            return res
                .status(400)
                .json({ status: "error", message: error.message });
        });
}


// TO DELETE USER BY USER_ID
module.exports.apiDeletePractitioner = async (req, res) => {
    const {id:practitionerId}=req.params;
    const practitioner = await Practitioner.findById(practitionerId);
    if (practitioner) {
        await Practitioner.deleteOne(practitionerId).then(()=>{
            return res.json({ status: true, message: "Practitioner deleted successfully" });
        }).catch((error)=>{
            return res.json({ status: true, message: error?.message });
        })
    }
    else
        return res.status(404).json({ status: false, message: 'Practitioner not found' });
}
