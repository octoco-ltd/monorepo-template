import {UserRepository} from "../repositories/userRepository";

/*
Service layers contain the logic or requests to 3rd parties. These layers can call any repository and also implement
inversion of control for tests
 */

export interface UserService {

}

export class UserService implements UserService {
    constructor(private userRepo: UserRepository) {
    }
}