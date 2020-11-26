const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator')

exports.crearProyecto = async (req, res) => {


    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // Guardar el creador vía JWT
        proyecto.creador = req.usuario.id;

        // guardar el proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(400), send('Hubo un error')
    }
}

// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json({ proyectos });
    } catch (error) {
        console.log(error);
        res.status(400), send('Hubo un error')
    }
}

// Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    // extraer la información del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {

        // Revisar el Id
        let proyecto = await Proyecto.findById(req.params.id);

        // Si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });

        }
        // actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }
}


// Eliminar un proyecto
exports.eliminarProyecto = async (req, res) => {
    try {

        // Revisar el Id
        let proyecto = await Proyecto.findById(req.params.id);

        // Si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });

        }
        // Eliminar proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: `El proyecto con nombre: ${proyecto.nombre} fue eliminado` })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }
}

