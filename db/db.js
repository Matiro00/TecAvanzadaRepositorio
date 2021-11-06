const mysql= require('mysql');
const conexion= mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSOWRD,
    database: process.env.DB_DATABASE
})

conexion.connect((error)=>{
    if(error){
        console.log('ERROR EN LA CONEXION: '+error)
        return;
    }
    console.log('CONEXION CON LA BASE ESTABLECIDA');
});

module.exports=conexion;