const adminAuth=(req,res,next)=>{
    console.log("Admin middleware");
    //Logic of checking if the request is authorized or not
    const token="xyz";
    const isAdminAuthorized=token==="xyz";
    if(isAdminAuthorized){
        next();
    }else{
        res.status(401).send("Not Authorized");
    }
    
}
module.exports={adminAuth};