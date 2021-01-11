<?php 
$accion = $_POST['accion'];
$id_proyecto = (int) $_POST['id_proyecto']; // Con el int nos aseguramos que lo tome como un entero
$tarea = $_POST['tarea'];

if($accion === 'crear') {

    //Importar la conexion
    include '../funciones/conexion.php';

    // El try catch nos permite que en caso de que haya un error el programa siga funcionando y tambien nos devuelva un mensaje de error
    try{
        //Realizar la consulta a la base de datos
       $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?) ");
       $stmt->bind_param('si', $tarea, $id_proyecto);
       $stmt->execute();
      if($stmt->affected_rows > 0){
          $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'tarea' => $tarea
          );
      } else{
          $respuesta = array(
              'respuesta' => 'error'
          );
      }
       $stmt->close();
       $conn->close();
    } catch(Exception $e) {
        //En caso de un error, tomar la exepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);

  

    
}

?>