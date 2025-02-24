import { Request, Response } from 'express';
import Course from '../models/Course';
import Category from '../models/Category';
import Modality from '../models/Modality';
import AvgCourse from '../models/avg_course';

// Obtener todos los cursos
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error al obtener los cursos:', error);
    res.status(500).json({ message: 'Error al obtener los cursos.' });
  }
};

// Obtener un curso por ID
export const getCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const course = await Course.findOne({
      where: {id: id},
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_name']
        },
          {
            model: Modality,
            as: 'modality',
            attributes: ['type']
          },
          {
            model: AvgCourse,
            as: 'averageCourse',
            attributes: ['avg']
          }
        
      ],
      
    });
    if (!course) {
      return res.status(404).json({ message: 'Curso no encontrado.' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Error al obtener el curso:', error);
    res.status(500).json({ message: 'Error al obtener el curso.' });
  }
};

// Obtener la cantidad total de cursos
export const getTotalCourses = async (req: Request, res: Response) => {
  try {
    const totalCourses = await Course.count();
    res.status(200).json({ totalCourses });
  } catch (error) {
    console.error('Error al obtener la cantidad total de cursos:', error);
    res.status(500).json({ message: 'Error al obtener la cantidad total de cursos.' });
  }
};

// Crear un nuevo curso
export const createCourse = async (req: Request, res: Response) => {
  console.log('Datos recibidos:', req.body);
  const { body } = req.body;
  
  try {
    const { name, categoryId, modalityId, teacherId, price } = req.body;
  
    // Validar campos requeridos
    if (!name || !categoryId || !modalityId || !teacherId || !price ) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios: name, categoryId, modalityId, price' });
    }
  
    console.log('Intentando crear el curso con:', {
      name,
      category_id: categoryId,
      modality_id: modalityId,
      professor_id: teacherId,
      price: price
    });
  
    const newCourse = await Course.create({
      name,
      category_id: categoryId,
      modality_id: modalityId,
      professor_id: teacherId,
      price: price
    });
  
    res.status(201).json(newCourse);
  
  } catch (error) {
    console.error('Error al crear el curso:', error);
  }
  
};

// Actualizar un curso existente
export const updateCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Curso no encontrado.' });
    }
    if (!name) {
      return res.status(400).json({ message: 'El nombre del curso es obligatorio.' });
    }
    await course.update({ name });
    res.status(200).json(course);
  } catch (error) {
    console.error('Error al actualizar el curso:', error);
    res.status(500).json({ message: 'Error al actualizar el curso.' });
  }
};

// Eliminar un curso
export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Curso no encontrado.' });
    }
    await course.destroy();
    res.status(200).json({ message: 'Curso eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el curso:', error);
    res.status(500).json({ message: 'Error al eliminar el curso.' });
  }
  
};

// get presential courses
export const getPresentialCourses = async (req: Request, res: Response) => {
  try {
    const presentialCourses = await Course.findAll({
      where: { modality_id: 1 },
    });
    console.log(presentialCourses)
    res.status(200).json(presentialCourses);
  } catch (error) {
    console.error('Error al obtener los cursos presenciales:', error);
    res.status(500).json({ message: 'Error al obtener los cursos presenciales.' });
  }
};

// get online courses
export const getOnlineCourses = async (req: Request, res: Response) => {
  try {
    const onlineCourses = await Course.findAll({
      where: { modality_id: 2 },
    });
    res.status(200).json(onlineCourses);
  } catch (error) {
    console.error('Error al obtener los cursos online:', error);
    res.status(500).json({ message: 'Error al obtener los cursos online.' });
  }
};

