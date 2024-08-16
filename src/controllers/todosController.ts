import { Request, Response } from "express";
import { Pool } from "pg";
import { envs } from "../config/envs";

export class TodosController {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: envs.HOST
        })
    }

    public getTodos = async (req: Request, res: Response) => {
        try {
            const resultado = await this.pool.query('SELECT * FROM todos');
            const todos = resultado.rows;

            return res.status(200).json(todos);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: `Error al obtener tareas: ${error}` })
        }
    }

    public getTodoById = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ error: 'Bad request' });

        try {
            const resultado = await this.pool.query('SELECT * FROM todos WHERE id = $1', [id]);
            const todo = resultado.rows[0];

            if (!todo) return res.status(400).json({ mensaje: 'Tarea no encontrada' });

            return res.status(200).json(todo);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: `Error al obtener tarea: ${error}` })
        }
    }

    public createTodo = async (req: Request, res: Response) => {
        const { texto } = req.body;
        if (!texto) return res.status(400).json({ error: 'El texto es requerido' });

        try {
            await this.pool.query('INSERT INTO todos (todo) VALUES ($1)', [texto]);
            return res.status(200).json({
                codigo: '200 OK',
                mensaje: `La tarea se agregó exitosamente: ${texto}`
            });
        } catch (error) {
            return res.status(500).json({ error: `Error al insertar tarea: ${error}` })
        }
    }

    public updateTodo = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { texto } = req.body;
        console.log("id: ", id)
        console.log("texto: ", texto)
        if (!texto) return res.status(400).json({ error: 'El texto es requerido' });

        try {
            const resultado = await this.pool.query('UPDATE todos SET todo = $1 WHERE id = $2', [texto, id]);

            return res.status(200).json({
                codigo: '200 OK',
                mensaje: `Tarea con id ${id} actualizada correctamente`
            })
        } catch (error) {
            return res.status(500).json({ error: `Error al actualizar tarea: ${error}` })
        }
    }

    public deleteTodo = async (req: Request, res: Response) => {
        const id = req.params.id;

        try {
            const resultado = await this.pool.query('DELETE FROM todos WHERE id = $1', [id]);
            if (!resultado) return res.status(400).json({ mensaje: `Tarea con id ${id} no encontrada` });
            else res.status(200).json({
                codigo: '200 OK',
                mensaje: `Tarea con id ${id} eliminada correctamente`
            });
        } catch (error) {
            return res.status(500).json({ error: `Error al eliminar tarea: ${error}` })
        }
    }
}