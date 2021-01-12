eventListeners();

//Variables globales
//Lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {

    //Document Ready
    document.addEventListener('DOMContentLoaded', function(){
        actualizarProgreso();
    });

    //Boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //Boton para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    //Botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
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
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">

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
                //Seleccionar el parrafo con la lista vacia
                var parrafoListaVacia = document.querySelectorAll('.lista-vacia') //querySelectorAll regresa un segundo parametro que se llama length
                if(parrafoListaVacia.length > 0 ){
                    document.querySelector('.lista-vacia').remove()
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
                
                //Actualizar el progreso
                actualizarProgreso();
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
// Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();

    // console.log('click en listado');
    // console.log(e.target)//Tengo acceso a que especificamente el usuario le esta dando click, se le conoce como delegation

    if(e.target.classList.contains('fa-check-circle')){
        if(e.target.classList.contains('completo')){
            e.target.classList.remove('completo')
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    } 

    if(e.target.classList.contains('fa-trash')){
        Swal.fire({
            title: 'Estas seguro(a)?',
            text: "Esta accion no puede deshacerse!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                var tareaEliminar = e.target.parentElement.parentElement;
                //Borrar de la BD
                eliminarTareaBD(tareaEliminar);

                //Borrar del HTML
                tareaEliminar.remove()
              Swal.fire(
                'Eliminado!',
                'Esta tarea ha sido eliminada.',
                'success'
              )
            }
          })
    } 
}

//Completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    //2- console.log(idTarea[1]); //Se coloca el 1 en corchetes porque es la posicion con la que se accede al ID en la consola del navegador 
    //1- console.log(tarea.parentElement.parentElement.id.split(':')); //ParentElement nos permite ir del hijo al padre en JS /// split te separa lo que le coloques en los parametros, es decir al estar en esos ':' el separara

    //Crear llamado a Ajax
    var xhr = new XMLHttpRequest();

    //Informacion
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);

    

    //Abrir la conexion 
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //On load 
    xhr.onload = function() {
        if(this.status == 200) {
            console.log(JSON.parse(xhr.responseText));
            //Actualizar el progreso
            actualizarProgreso();
        }
    }

    //Enviar la peticion 
    xhr.send(datos);
}

//Elimina las tareas de las BD
function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(':');
    
    //Crear llamado a Ajax
    var xhr = new XMLHttpRequest();

    //Informacion
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');

    

    //Abrir la conexion 
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //On load 
    xhr.onload = function() {
        if(this.status == 200) {
            console.log(JSON.parse(xhr.responseText));

            //Comprobar que haya tareas restantes
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if(listaTareasRestantes.length === 0 ){
                document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>"
            }
            //Actualizar el progreso
            actualizarProgreso();

        }
    }

    //Enviar la peticion 
    xhr.send(datos);
}

//Actualiza el avance del proyecto
function actualizarProgreso(){
    const tareas = document.querySelectorAll('li.tarea');

    //Obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo')

    //Determinar el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
    //Math.round redondea los numeros de la operacion que se esta ejecutando, es decir quita decimales 

    //Asignar el porcentaje a la barra
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%'; // style.width nos permite cambiar el ancho. avance lo requerimos como porcentaje lo cual hay que utilizar el mas y concatenar con el %


    //Mostrar alerta de proyecto terminado al 100
    if(avance === 100 ){
        Swal.fire({
            title: 'Proyecto Terminado',
            text: 'No tienes tareas pendientes!',
            showConfirmButton: true,
            icon: 'success'
        })
    } 
    
    
    // console.log(avance)
    // console.log(tareas.length); //Nos trae a la consola cuantos elementos tenemos de tareas

    
}