const express=require('express');

const app=express();
require("dotenv").config();

app.get('/',(req,res,next)=>{
    res.send('Hola mundo');
});
const PORT=process.env.PORT || 3001;

app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
