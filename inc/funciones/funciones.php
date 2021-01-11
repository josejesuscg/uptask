<?php 
//Obtiene la pagina actual que se ejecuta
    function obtenerPaginaActual() {
        $archivo = basename($_SERVER['PHP_SELF']);
        $pagina = str_replace(".php", "", $archivo); //str_replace remplaza los string por otro string es decir el index.php lo remplazo por el espacio en blanco
        return $pagina;
    }


/* Consultas */


/* Obtener todos los proyectos */
function obtenerProyectos() {
    include 'conexion.php';
    try {
        return $conn->query('SELECT id, nombre FROM proyectos');
    } catch(Exception $e) {
        echo "Error! : " . $e->getMessage();
        return false;
    }
}

// Obtener el nombre de proyecto
function obtenerNombreProyecto($id = null) {
    include 'conexion.php';
    try {
        return $conn->query("SELECT nombre FROM proyectos WHERE id = {$id}");
    } catch(Exception $e) {
        echo "Error! : " . $e->getMessage();
        return false;
    }
}
?>