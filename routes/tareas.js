// Rutas para crear proyectos
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crea una tarea
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

// obtener las tareas por proyectos
router.get('/',
    auth,
    tareaController.obtenerTarea
);

// actualizar tarea via ID
router.put('/:id',
    auth,
    tareaController.actualizarTarea
);

// Eliminar tarea via ID
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);


module.exports = router;