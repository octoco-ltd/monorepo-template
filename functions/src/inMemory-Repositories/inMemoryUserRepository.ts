import {IUserRepository} from "../repositories/userRepository";
import {User} from "@prisma/client";
import {NotFoundError} from "../utils/errors";
import {UserIM} from "../models/userModel";


export class InMemoryUserRepository implements IUserRepository {

    constructor(private seed: User[]) {
    }

    public async getAllUsers(): Promise<User[]> {
        /*
        This function gets all the users in the User Repository
         */
        return this.seed
    }

    public async getUserById(id: string): Promise<User> {
        /*
        This function gets a specific user from the DB by id
         */
        const user = this.seed.find((u) => u.id === id)
        if (!user) throw new NotFoundError(`UserRepository - getUserById - user with id: ${id} not found`)
        return user
    }

    public async createUser(userIM: UserIM): Promise<User> {
        /*
        This function creates a user in the DB
         */
        this.seed.push({...userIM, createdAt: new Date()})
        return this.seed[this.seed.length - 1]
    }

    public async getLastAddedUserInDB(): Promise<User> {
        /*
        This function gets the last added user in the DB
         */
        return this.seed[this.seed.length - 1]
    }
}