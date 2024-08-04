import jwt from 'jsonwebtoken'

const authenticateToken = (req,res,next) =>{
    const token = req.header('Authorization').split(' ')[1];
    if(!token){
        return res.status(401).json({
            error:'Access denied, no token provided'
        });
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    }catch(error){
        res.status(400).json({
            error:'Invalied token',
        });
    }
};

export default authenticateToken;