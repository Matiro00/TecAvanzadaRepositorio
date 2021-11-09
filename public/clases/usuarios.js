const usuarios= []

function unirseUsuario(id,nombre,room){
    const usuario ={id,nombre,room}
    usuarios.push(usuario)
    return usuario;
}
function getUsuariosPorId(id){
    return usuarios.find(usuario=>usuario.id===id)
}
function usuarioAbandona(id){
    const index = usuarios.findIndex(user=>user.id===id)
    if(index!==-1){
        return usuarios.splice(index,1)[0];
    }
}

function getRoomUsuarios(room){
    return usuarios.filter(user => user.room=room)
}

module.exports={
    unirseUsuario,
    getUsuariosPorId,
    usuarioAbandona,
    getRoomUsuarios
}