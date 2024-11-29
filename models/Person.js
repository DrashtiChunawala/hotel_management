const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the Person schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    work:{
        type: String,
        enum: ['chef', 'waiter', 'manager'],
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    address:{
        type: String
    },
    salary:{
        type: Number,
        required: true
    },
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
});

//next is a cb function of mongoose to decrypt the password 
personSchema.pre('save', async function (next) {
    const person = this;

    if (!person.isModified('password')) {
        console.log("Password not modified, skipping hashing.");
        return next();
    }

    try {
        console.log("Original Password:", person.password);

        const salt = await bcrypt.genSalt(10);
        console.log("Generated Salt:", salt);

        const hashedPassword = await bcrypt.hash(person.password, salt);
        console.log("Hashed Password:", hashedPassword);

        person.password = hashedPassword;
        console.log("Password successfully hashed.");
        next();
    } catch (err) {
        console.error("Error during password hashing:", err);
        return next(err);
    }
});


personSchema.methods.comparePassword = async function (candidatePassword){
    try {
        const isMatched = await bcrypt.compare(candidatePassword, this.password);
        if (isMatched) {
            console.log("Password is correct!");
        } else {
            console.log("Password is incorrect.");
        }
        return isMatched;
    } catch (error) {
        console.error("Error while comparing passwords:", error);
        throw error;
    }
}
// Create Person model
const Person = mongoose.model('Person', personSchema);
module.exports = Person;