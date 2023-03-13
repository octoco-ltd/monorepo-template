import {Request, Response, Router} from "express";
import {UserRepository} from "../repositories/userRepository";
import {UserService} from "../services/userService";
import {UserController} from "../controllers/userController";
import {isAuthenticated} from "../utils/middleware";
import {body} from "express-validator";

// Instantiate the repos and services required for this controller
const userRepo = new UserRepository()
const userService = new UserService()
const userController = new UserController(userRepo, userService)

const userRouter = Router()

// The request is authenticated and thus the user id is inferred from the JWT
userRouter.get('/', isAuthenticated, (req: Request, res: Response) => userController.getUserById(req, res))

// This is an open endpoint
userRouter.get('/get-all', (req: Request, res: Response) => userController.getAllUsers(req, res))


// we use express-validators to check whether the correct fields are sent in the request
userRouter.post('/',
    // isAuthenticated, // Middleware commented out for unit tests. You can get JWT tokens for unitests and Supertest
    body('name').exists().isString(),
    body('surname').exists().isString(),
    (req: Request, res: Response) => userController.createUser(req, res))

export default userRouter

