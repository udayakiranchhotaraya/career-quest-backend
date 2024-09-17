const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const educationSchema = new mongoose.Schema({
    institution : {
        type: String
    },
    degree : {
        type: String
    },
    yearOfCompletion : {
        type: String
    }
});

const experienceSchema = new mongoose.Schema({
    role: {
        type: String
    },
    company: {
        type: String
    },
    location: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    responsibilities: {
        type: String
    }
});

const userSchema = new mongoose.Schema({
    name : {
        firstName : {
            type: String,
            required: true
        },
        lastName : {
            type: String
        }
    },
    email : {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: props => `${props.value} is not a valid email.`
        }
    },
    mobile : {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return validator.isMobilePhone(value, 'en-IN');
            },
            message: props => `${props.value} is not a valid mobile number.`
        }
    },
    password : {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isStrongPassword(value);
            },
            message: props => `${props.value} is not a strong password.`
        }
    },
    profilePictureURL : {
        type: String
    },
    educations : [educationSchema],
    skills : [{
        type: String
    }],
    experiences : [experienceSchema],
    resumeURL : {
        type: String
    },
    profileVisibility: {
        type: String,
        enum: {
            values: ['private', 'public'],
            message: '{VALUE} is not supported'
        },
        default: 'public'
    },
    applications: [{
        job: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Job',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
    }]
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    const user = this;

    if (!(user.isModified('password'))) {
        next();
    }

    try {
        const salt = await bcrypt.genSalt(12);

        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = String(hashedPassword);
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;