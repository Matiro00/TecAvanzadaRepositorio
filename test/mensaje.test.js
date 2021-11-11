
const {formatearMensaje,formatearMensajeParaGuardar,formatearMensajeViejosParaMostrar} = require('../public/clases/mensajes');
test('testeo mensaje para enviar',()=>{
    const waited={
        texto: expect.any(String),
        usuario: expect.any(String),
        tiempo: expect.any(String)
    }
    const result = formatearMensaje('pepe','hola');
    expect(result).toMatchObject(waited)
})
test('testeo mensaje para guardar',()=>{
    const waited={
        user_id:expect.any(Number),
        nombre:expect.any(String),
        room_id:expect.any(Number),
        texto:expect.any(String),
        tiempo:expect.any(String) 
    }
    const result = formatearMensajeParaGuardar(1,'pepe',2,'hola');
    expect(result).toMatchObject(waited)
})
test('testeo mensaje para enviar mensajes viejos',()=>{
    const waited={
        contenido: expect.any(String),
        emisor: expect.any(String),
        tiempo: expect.any(String)
    }
    const result = formatearMensajeViejosParaMostrar('pepe','hola','1970-01-01 00:00:01');
    expect(result).toMatchObject(waited)
})