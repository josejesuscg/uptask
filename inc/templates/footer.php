
<script src="js/sweetalert2.all.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script> <!-- Script nuevo de sweetalert -->


<?php 
    $actual = obtenerPaginaActual();
    if($actual === 'crear-cuenta' || $actual === 'login' ) {
        echo '<script src="js/formulario.js"></script>';
    }

?>

</body>
</html>