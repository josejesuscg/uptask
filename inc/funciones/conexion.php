<?php 

$conn = new mysqli('localhost', 'root', 'root', 'uptask'); //los parametros para MYSQLI (1-Nombre de servidor =  / 2-Usuario = root / 3-Password = root / 4-Nombre de base de datos = uptask)
// Hay dos formas MYSQLI y PDO. PDO te permite conectarte a otras mas bases de datos
// echo "<pre>";
// var_dump($conn->ping()); //Se utiliza para saber si la base de datos esta conectada con el ping(); o el var_dump($(nombre de variable))
// echo "</pre>";

//Otra forma de conexion erronea
if($conn->connect_error){
    echo $conn->connect_error;
} 
//Al no haber error no va a imprimir nada

$conn->set_charset('utf8');// Para que la base de datos agarre acentos, ñ y similares

?>