
eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}


function validarRegistro(e) {
    e.preventDefault(); //preventDefault permite que por ejemplo al dar click en submit(enviar) en un formulario no lo envie, por default los formularios se envian al llenarlos a lo que hayamos definido en el action (en este caso no hay action).

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value, 
        //Mediante el querySelector seleccionan en el formulario llamandolos por el ID correspondiente a cada uno, seran reflejados mediante el (.value) que es lo que se llene en el formulario por el (para var usuario y password).
        tipo = document.querySelector('#tipo').value;
        
        // console.log(usuario + " " + password); //Validar que tiene algo escrito.

        if(usuario === '' || password === '') {
            //La validacion fallo
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Los campos son obligatorios'
               
              })
        } else {
            //Ambos campos son correctos, mandar a ejecutar Ajax.

            //Datos que se envian al servidor
            var datos = new FormData(); // FormData nos permite estructurar nuestro llamado a Ajax, darle una llave y un valor.
            datos.append('usuario', usuario); 
            datos.append('password', password);
            datos.append('accion', tipo); //El primer parametro ' ' son las llaves y el siguiente elemento son los valores de los #ID en linea 12 y 15 (querySelector) .

            //Append nos sirve para agregar datos al formData y .get + 'nombre de llave' para ver el dato.
             // console.log(datos.get('usuario'))

             //CREAR LLAMADO A AJAX (PASO 1)

             var xhr = new XMLHttpRequest(); 

             //ABRIR LA CONEXION (PASO 2)
             
             xhr.open('POST', 'inc/modelos/modelo-admin.php', true); 
             // Como se envian los datos es el primer parametro en este caso se envian mediante 'POST' y el segundo parametro es a donde en este caso a 'inc/modelos/modelo-admin.php' y para finalizar un true para que sea un llamado asincrono.

             //RETORNO DE DATOS (PASO 3)
            //Con esto comprobamos que el status sea 200 eso quiere decir que el llamado fue exitoso, esto nos retorna una respuesta que viene del servidor mediante el console.log(xhr.responseText), desde el codigo que escribamos en el modelo-admin.php
             xhr.onload = function(){
                 if(this.status === 200) {
                    //  console.log(xhr.responseText); mediante arreglo en modelo-admin.php
                    //  console.log(JSON.parse(xhr.responseText)); //Json.parse toma los string y los convierte en objeto
                    var respuesta = JSON.parse(xhr.responseText);
                    console.log(respuesta);
                    //Si la respuesta es correcta
                    if(respuesta.respuesta === 'correcto') {
                        //Si es un nuevo usuario
                        if(respuesta.tipo === 'crear'){
                            Swal.fire({
                                icon: 'success',
                                title: 'Usuario Creado',
                                showConfirmButton: true,
                                text: 'El usuario se creo correctamente'
                                
                              });
                        } else if(respuesta.tipo === 'login'){
                            Swal.fire({
                                icon: 'success',
                                title: 'Login Correcto',
                                showConfirmButton: true,
                                text: 'Presione OK para continuar'
                                
                              })
                              .then(resultado =>{
                                  if(resultado.value) {
                                      window.location.href = 'index.php';
                                  }
                              })
                        }
                    } else {
                        // Hubo un error
                        Swal.fire({
                            title: 'Error',
                            text: 'Hubo un error',
                            showConfirmButton: true,
                            icon: 'error'
                        })
                    }
                 }
             }

             //ENVIAR LA PETICION (PASO 3)
             //La peticion se hace con xhr.send() y en el parametro en este caso lo mandamos al formData que vendria siendo datos
             xhr.send(datos);
    }
}