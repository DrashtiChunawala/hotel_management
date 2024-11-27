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
personSchema.pre('save', async function(next) {
    const person = this;

    //Hash the password only if it is new if it is old then no need to decrypt
    if(!person.isModified('password')) return next();

    try{
        //Hash the password logic

        //hash password generation
        const salt=await bcrypt.genSalt(10)
        console.log('salt', salt)
        //hash password
        const hashedPassword=await bcrypt.hash(person.password,salt)
        console.log(hashedPassword,"*****")
        //override the plain password with the hashed one
        person.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }   
})

personSchema.methods.comparePassword=async (candidatePassword)=>{
    try{

        //how compare works 
        //abc-->dfdfdshfgs
        //login->xyz

        //dfdfdshfgs -->extract salt
        //salt xyz-->sgdhasjgdjhasgd


        //use bcrypt to compare the provide password with the hashed password
        const isMatched=await bcrypt.compare(candidatePassword,this.password);
        return isMatched

    }catch(err){
        throw err;
    }
}
// Create Person model
const Person = mongoose.model('Person', personSchema);
module.exports = Person;