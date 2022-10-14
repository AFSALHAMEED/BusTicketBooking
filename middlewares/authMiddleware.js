const jwt = require('jsonwebtoken')

module.exports=(req,res,next)=>{

try {
    const token = req.headers.authorization.split(" ")[1]
if(!token){
    return res.send({
        message :"Auth Failed1",
        success:false
    })
}
const decoded = jwt.verify(token,process.env.jwt_secret)
console.log(decoded);
req.body.userId = decoded.userId
next()
} catch (error) {

    return res.send({
        message :"Auth Failed",
        success:false,

       
    })
}
}