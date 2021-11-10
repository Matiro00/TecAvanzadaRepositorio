const moment = require('moment');
function formatearMensaje(usuario,texto){
    return{
        usuario,
        texto,
        tiempo: moment().format('YYYY-MM-DD HH:mm:ss')
    }
}
function formatearMensajeParaGuardar(user_id,nombre,room_id,texto){
    return{
        user_id,
        nombre,
        room_id,
        texto,
        tiempo: moment().format('YYYY-MM-DD HH:mm:ss')
    }
}

module.exports={formatearMensaje,formatearMensajeParaGuardar};