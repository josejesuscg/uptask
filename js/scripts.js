eventListeners();

//Variables globales
//Lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    //Boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //Boton para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
}

function nuevoProyecto(e) {
    e.preventDefault();
   console.log('Presionaste en crear proyecto')

    //Crea un <input> para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);


    //Seleccionar el ID con el nuevoProyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //Al presionar enter crea el proyecto
    //keypress es un listener que te permite crear una funcion para alguna tecla que presione el usuario, en este caso buscamos la tecla ENTER mediante el numero wich o el KeyCode que arroja en la consola del navegador
    inputNuevoProyecto.addEventListener('keypress', function(e) {
        var tecla = e.which || e.keyCode;

        if(tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);//Remueve el input de escribir el nombre del nuevo proyecto y queda guardado en la funcion guardarProyectoDB(nombreProyecto)
        }
    })

}

function guardarProyectoDB(nombreProyecto) {
   //4 pasos para AJAX
   //Crear llamado ajax
   var xhr = new XMLHttpRequest();

   //Enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear')

   //Abrir la conexion 
   xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true); // 3 Parametros 'POST' = Tipo de request, La URL donde vamos a mandar la consulta 'inc/modelos/modelo-proyecto.php' , y al final si el llamado es asincrono 'true'.

   //En la carga 
   xhr.onload = function() {
        if(this.status === 200) {
            //Obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
            id_proyecto = respuesta.id_insertado,
            tipo = respuesta.tipo,
            resultado = respuesta.respuesta;

            //Comprobar la insercion
            if(resultado === 'correcto') {
                //fue exitoso
                if(tipo === 'crear') {
                    //se creo un nuevo proyecto
                    //Inyectar en el HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="${id_proyecto}">

                        ${proyecto}
                    `;

                    //agregar al html
                    listaProyectos.appendChild(nuevoProyecto);

                    //Enviar alerta
                    Swal.fire({
                        icon: 'success',
                        title: 'Proyecto Creado',
                        showConfirmButton: true,
                        text: 'El proyecto ' + proyecto + ' se creo correctamente'
                        
                      })
                      .then(resultado =>{
                      // .then para redireccionar cuando el usuario le de OK a la alerta mostrada
                      //Redireccionar a la nueva URL del proyecto creado
                        if(resultado.value) {
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }
                    })
                     

                } else {
                    //se actualizo o se eliminno
                }
            } else {
                //hubo un error
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error',
                    showConfirmButton: true,
                    icon: 'error'
                })
            }
        }

   }

   //Enviar el request
   xhr.send(datos);
}

// Agregar una nueva tarea 
function agregarTarea(e) {
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    
    //Validar que el nombre de la tarea no este vacio
    if(nombreTarea === ''){
        Swal.fire({
            title: 'Error',
            text: 'Esta tarea no puede ir vacia',
            showConfirmButton: true,
            icon: 'error'
        })
    } else {
        //La tarea no esta vacia, insertar en PHP 


        // Crear llamado a AJAX
        var xhr = new XMLHttpRequest();

        //Crear FORMDATA //El formdata nos permite almacenar en llave valor y enviar por ajax mejor
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value)
        // Abrir la conexion 
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        //ejecutarlo y respuesta
        xhr.onload = function() {
        if(this.status === 200){
            //todo correcto
            var respuesta = JSON.parse(xhr.responseText);
            
            //Asignar valores
            var resultado = respuesta.respuesta,
                tarea = respuesta.tarea,
                id_insertado = respuesta.id_insertado,
                tipo = respuesta.tipo;

            if(resultado === 'correcto') {
                //Se agrego correctamente
                if(tipo === 'crear'){
                    //Lanzar la alerta
                    Swal.fire({
                        title: 'Tarea Creada',
                        text: 'La tarea: ' + tarea + ' se creo correctamente',
                        showConfirmButton: true,
                        icon: 'success'
                    })
                }
                //Construir el template
                var nuevaTarea = document.createElement('li');

                //Agregamos el ID
                nuevaTarea.id = 'tarea:'+id_insertado;

                //Agregamos la clase tarea
                nuevaTarea.classList.add('tarea');

                //Insertar en html
                nuevaTarea.innerHTML = `
                    <p>${tarea}</p>
                    <div class="acciones">
                    <i class="far fa-check-circle"></i>
                    <i class="fas fa-trash"></i>
                </div>
                
                `;

                //Agregarlo al html
                var listado = document.querySelector('.listado-pendientes ul');
                listado.appendChild(nuevaTarea);

                //Limpiar formulario 
                document.querySelector('.agregar-tarea').reset();
            }else {
                //Hubo un error
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error',
                    showConfirmButton: true,
                    icon: 'error'
                })
            }
        }
    }

        //Enviar la consulta
        xhr.send(datos);
    }
}