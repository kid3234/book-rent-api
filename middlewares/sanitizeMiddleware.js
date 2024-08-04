import sanitize  from 'sanitize'

export const sanitizeInputs = (req,res,next)=>{
    Object.keys(req.body).forEach((key)=>{
        req.body[key] = sanitize(req.body[key]);
    })
    next();
}