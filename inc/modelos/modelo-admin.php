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
die(json_encode($_POST));

?>