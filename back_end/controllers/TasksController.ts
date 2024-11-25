import { Request, Response } from 'express';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';
const Task = require('../models/Task');
const Subject = require('../models/Subject'); // Importa el modelo Subject
const Course = require('../models/Course'); // Importa el modelo Course
const User = require('../models/User'); // Importa el modelo User


export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.findAll(); // Ejecuta un SELECT * FROM tasks
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: 'Tarea no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener la tarea:', error);
    res.status(500).json({ message: 'Error al obtener la tarea' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  console.log('req.body:', req.body);
  const { subjectId, userId, comments, punctuation, deadline } = req.body;

  try {
    // Verifica que todos los datos necesarios estén presentes
    if (!subjectId || !userId || !deadline) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Crea la tarea
    const task = await Task.create({
      subjectId,
      userId,
      comments,
      punctuation,
      deadline,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ message: 'Error al crear la tarea.', error });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { subjectId, userId, comments, punctuation, creationDate, deadline } = req.body;
    const [updated] = await Task.update({ subjectId, userId, comments, punctuation, creationDate, deadline }, {
      where: { id }
    });
    if (updated) {
      const updatedTask = await Task.findByPk(id);
      res.status(200).json(updatedTask);
    } else {
      res.status(404).json({ message: 'Tarea no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Task.destroy({
      where: { id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Tarea eliminada' });
    } else {
      res.status(404).json({ message: 'Tarea no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
};

export const getTasksByUserId = async (req: Request, res: Response): Promise<void> => { 
  const { userId } = req.params;

  try {
    const query = `
      SELECT 
        t.id AS tarea_id,
        t.comments AS tarea_comentarios,
        s.name AS materia_nombre,
        u.name AS profesor_nombre
      FROM 
        tasks t
      JOIN 
        subject s ON t.subjectId = s.id
      JOIN 
        course c ON s.courseId = c.id
      JOIN 
        user u ON c.professor_id = u.id
      WHERE 
        t.userId = :userId;
    `;

    const tasks = await sequelize.query(query, {
      replacements: { userId },
      type: QueryTypes.SELECT,
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas.' });
  }
};



export const getProgressByUserId = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    // Consulta SQL para calcular el progreso por materia
    const query = `
      SELECT 
        s.id AS subject_id,                 -- ID de la materia
        s.name AS materia_nombre,           -- Nombre de la materia
        u.name AS profesor_nombre,          -- Nombre del profesor
        ROUND((COUNT(t.id) / 10) * 100, 2) AS progreso_materia -- Progreso basado en tareas con puntuación asignada
      FROM 
        tasks t
      JOIN 
        subject s ON t.subjectId = s.id
      JOIN 
        course c ON s.courseId = c.id
      JOIN 
        user u ON c.professor_id = u.id
      WHERE 
        t.userId = :userId
        AND t.punctuation IS NOT NULL -- Solo incluir tareas con puntuación asignada
      GROUP BY 
        s.id, s.name, u.name;
    `;

    // Ejecución de la consulta SQL
    const progress = await sequelize.query(query, {
      replacements: { userId }, // Sustituye el :userId en la consulta
      type: QueryTypes.SELECT,  // Indica que queremos un resultado SELECT
    });

    // Enviar la respuesta JSON
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error al obtener el progreso del usuario:', error);
    res.status(500).json({ message: 'Error al obtener el progreso del usuario', error });
  }
};



