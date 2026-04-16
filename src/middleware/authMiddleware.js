const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next)=>{
// 1. header sy token lana 
const token =req.header('Authorization')?.split(' ')[1];

// check if token na ho
if(!token){
    return res.status(401).json({msg: "no token, authorization denied!"});

}
 try {
    // 2.token ko verify krna
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  3. request object mein user ka data dalna
    req.user = decoded;

    // agle function par bajhna
    next();
    
 } catch (error) {
    res.status(401).json({msg: "token valid nhi.."});
 }

};

module.exports = authMiddleware;