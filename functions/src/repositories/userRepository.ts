import {NotFoundError} from "../utils/errors";
import {User} from "@prisma/client";
import {UserIM} from "../models/userModel";
import {Context} from "../prisma/context";


/*
Repository layers are the deepest layers in our APIs. They may contain only CRUD operations and are the ONLY functions
which may communicate with the DB. Repositories have a one-to-one relationship with DB collections. Repositories may not
call each other nor may they contain ANY logic. It is also vital that the principle of dependency injection is followed
when setting up repositories since this will make unit testing simpler.

WE DO NOT HAVE ANY TRY CATCH BLOCKS IN THIS LAYER
 */


export interface IUserRepository {
    /*
    This is the interface for the UserRepository. It contains the list of functions which must be present in the actual
    repository and its in-Memory version
     */
    getAllUsers():Promise<User[]>
    getUserById(id: string):Promise<User>
    createUser(userIM: UserIM): Promise<User>
    getLastAddedUserInDB(): Promise<User>
}

export class UserRepository implements IUserRepository{

    constructor(private ctx: Context) {
    }

    public async getAllUsers(): Promise<User[]> {
        /*
        This function gets all the users in the User Repository
         */
        return this.ctx.prisma.user.findMany({})
    }

    public async getUserById(id: string): Promise<User> {
        /*
        This function gets a specific user from the DB by id
         */
        const user = await this.ctx.prisma.user.findUnique({where: {id}})
        if (!user) throw new NotFoundError(`UserRepository - getUserById - user with id: ${id} not found`)
        return user
    }

    public async createUser(userIM: UserIM): Promise<User> {
        /*
        This function creates a user in the DB
         */
        return this.ctx.prisma.user.create({data: userIM})
    }

    public async getLastAddedUserInDB(): Promise<User> {
        /*
        This function gets the last added user in the DB
         */
        const users = this.ctx.prisma.user.findMany({
            orderBy: [{
                createdAt: 'desc'
            }],
            take: 1
        })
        return users[0]
    }

}