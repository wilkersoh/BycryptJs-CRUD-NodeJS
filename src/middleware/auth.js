const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth = async (req, res, next) => {
    try{
        // Authorization 是postman里设置
        // reaplce Bearer 后面要有space， 不然核对 不对
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisismynewcourse');
        // ({写两个原因是 这个是一个Obj 它 nested两个资料})
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user;
        next();
    } catch(e){
        console.log(e);
        res.status(401).send({ error: "Please authenticate"})
    }
}

module.exports = auth;