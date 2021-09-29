
const router = require("express").Router();
const User = require("../models/twitterUser");
const bcrypt = require("bcrypt");

//User Sign Up
router.post("/register", async (req, res) => {
    try {
        // Create Password
        const gernerateSalt = await bcrypt.genSalt(10);
        const EncryptPassword = await bcrypt.hash(req.body.password, gernerateSalt);

        // Create User Object
        const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: EncryptPassword,
        });

        // Save user and return respond
        const user = await newUser.save();
        res.status(200).json(user);
    } 
    
    catch (err) {
        console.log("Error is ", err.message);
    }

    await User.save();
    res.send("Sucessfully Registered! ");
});

//Login

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("Not Registered yet");

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        
        !validPassword && res.status(400).json("Wrong Password");

        //Creation of Session
        req.session.user = req.body.email;

        res.status(200).json(user);
    } 
    catch (err) {
        console.log("Error is ", err.message);
    }
});

//logout
router.get("/logout", (req, res) => {
    //Session Destroy
    req.session.destroy();

    res.send("Logging out");
});

module.exports = router;
