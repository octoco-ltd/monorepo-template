
/*
    Your services layer will typically contain all the logic and requests to third parties. For that reason we create
    a stubbed, in-memory version which implement the real service's interface
 */

import {IUserService} from "../services/userService";
import {IUserRepository} from "../repositories/userRepository";
import {User} from "@prisma/client";
import {UserIM} from "../models/userModel";

export class InMemoryUserService implements IUserService {
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