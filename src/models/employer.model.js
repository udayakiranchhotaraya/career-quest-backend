const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const addressSchema = new mongoose.Schema({
    addressLine01 : {
        type: String
    },
    addressLine02 : {
        type: String
    },
    addressLine03 : {
        type: String
    },
    city : {
        type: String
    },
    state : {
        type: String
    },
    country : {
        type: String
    },
    pin : {
        type: String
    }
});

const employerSchema = new mongoose.Schema({
    accessEmail : {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    accessPassword : {
        type: String,
        required: true,
        validate : {
            validator: function (value) {
                return validator.isStrongPassword(value);
            },
            message: props => `${props.value} is not a strong password`
        }
    },
    companyName : {
        type: String,
        required: true
    },
    companyDescription : {
        type: String
    },
    industry : {
        type: String
    },
    numberOfEmployees : {
        type: Number
    },
    yearOfEstablishment : {
        type: String
    },
    contactTelephone : {
        type: String,
        validate: {
            validator: function (value) {
                return validator.isMobilePhone(value, 'en-IN');
            },
            message: props => `${props.value} is not a valid mobile number.`
        }
    },
    contactEmail : {
        type: String,
        validate : {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: props => `${props.value} is not a valid email.`
        }
    },
    companyWebsite : {
        type: String
    },
    address : {
        type: addressSchema
    },
    location : {
        type : {
            type: String,
            enum: ['Point']
        },
        coordinates : {
            type: [Number]
        }
    },
    imageURLs : [{
        type: String
    }],
    companyLogoURL : {
        type: String
    },
    benefits : {
        type: String
    },
    profileVisibility : {
        type: Boolean
    },
    jobPostings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    }],
}, {
    timestamps: true
});

employerSchema.index({ location: '2dsphere' });

employerSchema.pre('save', async function (next) {
    const company = this;

    if (!(company.isModified('accessPassword'))) {
        next();
    }

    try {
        const salt = await bcrypt.genSalt(12);

        const  hashedPassword = await bcrypt.hash(company.accessPassword, salt);

        company.accessPassword = String(hashedPassword);
        next();
    } catch (error) {
        return next(error);
    }
});

employerSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.accessPassword);
        return isMatch;
    } catch (error) {
        return next(error);
    }
}

const EmployerModel = mongoose.model('Employer', employerSchema);
module.exports = EmployerModel;