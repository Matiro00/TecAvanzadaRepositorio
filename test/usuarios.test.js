const { unirseUsuario}= require('../public/clases/usuarios');
test('testeo obtener los usuarios de la room',()=>{
    const waited={
        id: expect.any(Number),
        nombre: expect.any(String),
        room: expect.any(Number)
    }
    const result = unirseUsuario(1,'pepe',1);
    console.log(result)
    expect(result).toMatchObject(waited)
})