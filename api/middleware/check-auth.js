const jwt = require('jsonwebtoken');

module.exports = (req , res , next)=>{
  try {
    let token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    const decoded = jwt.verify(token , 'secret');
    req.userData = decoded;
    next();
  } catch (e) {
    res.status(401).json({
      message: "token is failed!"
    });
  } finally {

  }
};
