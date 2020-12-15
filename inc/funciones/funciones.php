<?php 
    function obtenerPaginaActual() {
        $archivo = basename($_SERVER['PHP_SELF']);
        $pagina = str_replace(".php", "", $archivo); //str_replace remplaza los string por otro string es decir el index.php lo remplazo por el espacio en blanco
        return $pagina;
    }

?>