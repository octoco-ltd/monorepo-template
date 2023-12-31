
/*
Service layers contain the logic or requests to 3rd parties. These layers can call any repository and also implement
inversion of control for tests
 */

import {IUserRepository} from "../repositories/userRepository";
import {UserIM} from "../models/userModel";
import {User} from "@prisma/client";

export interface IUserService {
    createNewUserBasedOnLastUserAddedToDB(): Promise<User>
}

export class UserService implements IUserService {
    constructor(private userRepo: IUserRepository) {
    }

    public async createNewUserBasedOnLastUserAddedToDB(): Promise<User> {
        /*
            Just an example of services layer logic
         */
        const oldUser = await this.userRepo.getLastAddedUserInDB()

        const newUserIM: UserIM = UserIM.parse(oldUser)
        newUserIM.id = oldUser.id + 'AABBCC'

        return await this.userRepo.createUser(newUserIM)
    }
}