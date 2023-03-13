import {Request, Response} from "express";
import {UserRepository} from "../repositories/userRepository";
import {ResultWithValue} from "../models/result";
import * as httpCodes from "http-status-codes";
import {errorStatusCode} from "../utils/errors";
import {UserService} from "../services/userService";
import {validationResult} from "express-validator";
import {UserIM} from "../models/userModel";

/*
Controllers are class based and handle all things HTTP. Controllers are the top layer of the API and is the only thing
which has knowledge of the principle of HTTP. Typically, you'll have a controller per collection in your DB. Controllers
call the repository layers directly or if logic is required they call a services layer before calling the repository layer.
 */

export class UserController {
    constructor(private userRepo: UserRepository, private userService: UserService) {
    }

    public async getAllUsers(req: Request, res: Response) {
        /*
        Controller function for getting all users in the DB
         */
        try{
            const users = await this.userRepo.getAllUsers();
            const tempResult: ResultWithValue<any> = {
                isSuccess: true,
                value: users,
                httpStatus: httpCodes.StatusCodes.OK,
                errorMessage: "",
            };
            return res.status(tempResult.httpStatus).send(tempResult);
        } catch (err) {
            const statusCode = errorStatusCode(err); // Helper function which derives the HTTP code from the error type. Default is 500
            console.error(err.message);
            console.error(err.stack);
            const tempResult: ResultWithValue<any> = {
                isSuccess: false,
                value: null,
                httpStatus: statusCode,
                // TS error messages and stack traces are useless. We provide a stack trace (kind of) in die error messages
                errorMessage: `usersController - getAllUsers Error: ${err.message}`,
            };
            return res.status(tempResult.httpStatus).send(tempResult);
        }
    }

    public async getUserById(req: Request, res: Response) {
        /*
        Controller function for getting a specific user in the DB
         */
        try{
            const uid = res.locals.uid;
            const user = await this.userRepo.getUserById(uid);
            const tempResult: ResultWithValue<any> = {
                isSuccess: true,
                value: user,
                httpStatus: httpCodes.StatusCodes.OK,
                errorMessage: "",
            };
            return res.status(tempResult.httpStatus).send(tempResult);
        } catch (err) {
            const statusCode = errorStatusCode(err);
            console.error(err.message);
            console.error(err.stack);
            const tempResult: ResultWithValue<any> = {
                isSuccess: false,
                value: null,
                httpStatus: statusCode,
                errorMessage: `usersController - getUserById Error: ${err.message}`,
            };
            return res.status(tempResult.httpStatus).send(tempResult);
        }
    }

    public async createUser(req: Request, res: Response) {
        /*
        Controller function for creating a user in the DB
         */
        try{
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const userIM: UserIM = {
                id: req.body.id,
                name: req.body.name,
                surname: req.body.surname
            }

            const user = await this.userRepo.createUser(userIM)

            const tempResult: ResultWithValue<any> = {
                isSuccess: true,
                value: user,
                httpStatus: httpCodes.StatusCodes.OK,
                errorMessage: "",
            };
            return res.status(tempResult.httpStatus).send(tempResult);
        } catch (err) {
            const statusCode = errorStatusCode(err);
            console.error(err.message);
            console.error(err.stack);
            const tempResult: ResultWithValue<any> = {
                isSuccess: false,
                value: null,
                httpStatus: statusCode,
                errorMessage: `usersController - getUserById Error: ${err.message}`,
            };
            return res.status(tempResult.httpStatus).send(tempResult);
        }
    }
}