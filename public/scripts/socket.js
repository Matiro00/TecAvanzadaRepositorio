const chatInput = document.getElementById('chat-input');
const saveMsgButton=document.getElementById('leave-saving');
const chatScroll = document.querySelector('.container-mensajes');
const salaNombre= document.getElementById('sala-nombre');
const usuarioLista= document.getElementById('usuarios-lista');


const socket = io()
socket.emit('unirseSala')

socket.on('usuariosEnRoom',(users)=>{

    mostrarUsuarios(users)
})

socket.on('alerta', mensaje => {
    enviarMensaje(mensaje);
    chatScroll.scrollTop= chatScroll.scrollHeight;
    
})

socket.on('mensaje', mensaje => {
    enviarMensaje(mensaje);
    chatScroll.scrollTop= chatScroll.scrollHeight;
    
})

function leaveSaving(){
    console.log('dadasd')
    socket.emit('disconnectSaving')
};
chatInput.addEventListener('submit', e => {
    e.preventDefault();

    const msg = e.target.elements.mensaje.value;

    socket.emit('mensaje', msg)

    e.target.elements.mensaje.value='';
    e.target.elements.mensaje.focus()
});

function enviarMensaje(mensaje) {
    const div = document.createElement('div');
    div.classList.add('mensaje');
    div.innerHTML = `<p class="emisor bold">
    ${mensaje.usuario} <span>${mensaje.tiempo}</span>
    </p>
    <p class="contenido padding-bottom">
    ${mensaje.texto}
    </p>`;
    document.querySelector('.container-mensajes').appendChild(div);
}


function mostrarUsuarios(users){
    usuarioLista.innerHTML=`
    ${users.map(usuario=>`<li class="user-on-list">${usuario.nombre}</li>`).join()}
    `;
}

