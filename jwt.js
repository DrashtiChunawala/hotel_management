const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  //extract the jwt token form the request headers
  const token = req.headers.authorization.split(" ")[1];
  if (!token || !token.startsWith("Bearer "))
    return res.status(401).json({ error: "Token not provided" });

  try {
    //verify the token
    //in here "1234" is secret key from env
    // const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    const decoded = jwt.verify(token, "1234");
    //attach the user details to the request object
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

//Function for generating token

const generateToken = (userData) => {
  const jwtSecretKey = "1234";

  if (!jwtSecretKey) {
    throw new Error("not defined in the environment variables.");
  }

  console.log("Generating token for:", userData);

  return jwt.sign(userData, jwtSecretKey);
};

module.exports = { jwtAuthMiddleware, generateToken };
