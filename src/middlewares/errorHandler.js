function errorHandler(error,req,res,next){
    const statusCode=error.statusCode || 500
    
    if(statusCode===500){
        console.log('[ERROR NO CONTROLADO]',error)
    }
   
    res.statusCode(statusCode).json({
        message:statusCode===500? 'Error interno del servidor': error.message
    })
}
module.exports=errorHandler