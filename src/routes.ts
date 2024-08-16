import { Router } from "express";
import { TodosController } from "./controllers/todosController";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        const todosController = new TodosController();

        router.get('/api/todos', todosController.getTodos);
        router.get('/api/todos/:id', todosController.getTodoById);
        router.post('/api/todos', todosController.createTodo);
        router.put('/api/todos/:id', todosController.updateTodo);
        router.delete('/api/todos/:id', todosController.deleteTodo)

        return router;
    }
}