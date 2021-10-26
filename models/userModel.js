const mongoose = require("mongoose");
let { PASSWORD } = process.env || require('../secrets');
const emailValidator = require("email-validator");
const bcrypt = require('bcrypt');
// connection form
let DB_LINK = `mongodb+srv://admin:${PASSWORD}@cluster0.fzqgp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(DB_LINK)
    .then(function (db) {
        // console.log(db);
        console.log("connected to db");
    }).catch(function (err) {
        console.log("err", err);
    })

// syntax of adding entries in mongodb
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "kindly Enter the name"]
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function () {
            return emailValidator.validate(this.email);
        }
    },
    password: {
        type: String,
        minlength: 7,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
        minlength: 7,
        validate:
            function () {
                return this.password == this.confirmPassword
            },
    },
    createdAt: Date,
    token: String,
    role: {
        type: String,
        enum: ["admin", "user", "manager"],
        default: "user"
    },
    bookings: {
        // array of object id
        type: [mongoose.Schema.ObjectId],
        ref: "bookingModel"
    }
});

// order matters
userSchema.pre("save", async function () {
    // typical to encrypt text
    const salt = await bcrypt.genSalt(10);
    // password convert to text
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
})
userSchema.method.resetHandler =
    async function (password, confirmPassword) {
        const salt = await bcrypt.genSalt(10);
        // password convert to text
        this.password = await bcrypt.hash(this.password, salt);
        this.password = password;
        this.confirmPassword = this.confirmPassword;
        // token reuse is not possible
        this.token = undefined;
    }
const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel