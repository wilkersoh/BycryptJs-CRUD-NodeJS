const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true, // cannot has same
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 15,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error('Password cannot contain "password')
            }
        }
    },  
    age: {
        type: Number,
        default: 1,
        validate(value){
            if(value < 0 ){
                throw new Error('Age must above zero')
            }
        }
    }
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Cannot to login')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user
}


userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    } 


    next();
})


const User = mongoose.model('User', userSchema);


module.exports = User;