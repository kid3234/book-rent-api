export const validationMiddleware = (schema) => (req,res,next)=>{
    try{

    }catch(error){
        res.status(400).json({
            error:error.errors
        })
    }
};