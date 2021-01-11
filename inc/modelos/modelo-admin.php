<?php

//MANERA DE SABERLO MEDIANTE UN ARREGLO 
// $arreglo = array (
//     'respuesta' => 'Desde MODELO!'
// );

// die(json_encode($arreglo));

//Json_encode nos va a permitir convertir un arreglo a Json
//Json en un formato intermedio entre JavaScript y PHP
//Se comunican ambos muy bien, se le dice que es un formato de transporte
//Nos va a permitir enviar datos del formulario a PHP y de PHP al formulario
//die viene siendo como un echo con json_encode($arreglo)
//Va a ser la respuesta al xhr.responseText del onload


//FOMRA RECOMENDADA DE ASEGURAR QUE TUS DATOS DEL FORMDATA ESTAN RECIBIDOS EN TUS ARCHIVOS PHP
// die(json_encode($_POST));

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if($accion === 'crear') {
    //Codigo para crear los administradores

    //Hashear Passwords
    $opciones = array(
        'cost' => 12
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

    //Importar la conexion
    include '../funciones/conexion.php';

    // El try catch nos permite que en caso de que haya un error el programa siga funcionando y tambien nos devuelva un mensaje de error
    try{
        //Realizar la consulta a la base de datos
       $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
       $stmt->bind_param('ss', $usuario, $hash_password);
       $stmt->execute();
      if($stmt->affected_rows > 0){
          $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
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

if($accion === 'login'){
    // Escribir codigo que loguee los administradores

    //Importar la conexion
    include '../funciones/conexion.php';

    try {
        //Seleccionar el administador de la base de datos 
        $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        //loguear el usuario
        $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
        $stmt->fetch();
      if($nombre_usuario){
          //El usuario existe, verificar el password
          if(password_verify($password, $pass_usuario)) {
              //Iniciar la sesion
              session_start();
              $_SESSION['nombre'] = $usuario;
              $_SESSION['id'] = $id_usuario;
              $_SESSION['login'] = true;
              //login correcto
              $respuesta = array(
                'respuesta' => 'correcto',
                'nombre' => $nombre_usuario,
                'tipo' => $accion
            );
          } else {
              //login incorrecto, enviar error
              $respuesta = array(
                  'resultado' => 'Password Incorrecto'
              );
          }

      } else {
          $respuesta = array(
              'error' => 'Usuario no existe'
          );
      }
        $stmt->close();
        $conn->close();
    }catch(Exception $e) {
        //En caso de un error, tomar la exepcion
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}
?>