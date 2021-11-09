const moment = require('moment');
function formatearMensaje(usuario,texto){
    return{
        usuario,
        texto,
        tiempo: moment().format('YYYY-MM-DD HH:mm:ss')
    }
}
module.exports=formatearMensaje;