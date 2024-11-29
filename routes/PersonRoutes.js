const express = require("express");
const router = express.Router();
const Person = require("./../models/Person");
const {jwtAuthMiddleware,generateToken} =require("../jwt")

// POST route to add a person
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; // Assuming the request body contains the person data

    // Create a new Person document using the Mongoose model
    const newPerson = new Person(data);

    // Save the new person to the database
    const response = await newPerson.save();
    console.log("data saved");
    const payload={
        username:response.username,
        id:response.id
    }
    const token=generateToken(payload)
    console.log("token:",token)
    res.status(200).json({response:response, token:token});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//login the user
router.post("/login", async (req, res) => {
  try {
    //extract the credentials from the user
    const { username, password } = req.body;
    //find user by username
    const user = await Person.findOne({ username: username });
    //if user not found or password not matched then return erro
    const isPasswordCorrect = await user.comparePassword(password);
    if (!user || !isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    //generate a token for the user
    const payload = {
      username: user.username,
      id: user.id,
    };
    console.log(payload);

    const token = generateToken(payload);
    console.log(token);
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get user profile 
router.get('/profile',jwtAuthMiddleware,async(req, res) => {
  try{
    const userData=req.user
    const userId=await userData.id
    const user=await Person.findById(userId)
    if(!user){
      return res.status(404).json({error: "User not found"})
    }
    res.status(200).json({user})
  }catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

router.get("/",jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await Person.find();

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//parameterized url
router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType; // // Extract the work type from the URL parameter
    if (workType == "chef" || workType == "manager" || workType == "waiter") {
      const response = await Person.find({ work: workType });
      console.log("response fetched");
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "Invalid work type" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id; // Extract the id from the URL parameter
    const updatedPersonData = req.body; // Updated data for the person

    const response = await Person.findByIdAndUpdate(
      personId,
      updatedPersonData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validation
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }

    console.log("data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const personId = req.params.id; // Extract the person's ID from the URL parameter

    // Assuming you have a Person model
    const response = await Person.findByIdAndDelete(personId);
    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }
    console.log("data delete");
    res.status(200).json({ message: "person Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
