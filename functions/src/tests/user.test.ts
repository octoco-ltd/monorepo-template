import {describe, test} from "@jest/globals";
import {UserRepository} from "../repositories/userRepository";
import {InMemoryUserService} from "../inMemory-Services/inMemoryUserService";
import { MockContext, Context, createMockContext } from '../prisma/context'
import {InMemoryUserRepository} from "../inMemory-Repositories/inMemoryUserRepository";

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
})

/*
    If you configure your controller layer correctly then it should only be necessary to test your services and repo layers
    There should not be any "testable" logic in your controller layers
 */



describe('Test UserRepository', () => {
    test('It tests whether a user can be created in the DB', async () => {
        const userRepo = new UserRepository(ctx)
        const user = {'id': 'ab', 'name': 'James', 'surname': 'de Villiers', 'createdAt': new Date()}
        mockCtx.prisma.user.create.mockResolvedValue(user)
        const res = await userRepo.createUser(user)
        expect(res).toStrictEqual(user)
    })

    test('It tests whether all users can be retrieved from the DB', async () => {
        const userRepo = new UserRepository(ctx)
        const user = {'id': 'ab', 'name': 'James', 'surname': 'de Villiers', 'createdAt': new Date()}
        mockCtx.prisma.user.findMany.mockResolvedValue([user])
        const result = await userRepo.getAllUsers()
        expect(result).toStrictEqual([user])
    })

})

describe('Test UserServices', () => {
    const userRepository = new InMemoryUserRepository([{'id': 'ab', 'name': 'James', 'surname': 'de Villiers', 'createdAt': new Date()}])
    const userService = new InMemoryUserService(userRepository)
    test('It tests whether the logic in our service layer works', async () => {

        const result = await userService.createNewUserBasedOnLastUserAddedToDB()

        const newUser = {'id': 'abAABBCC', 'name': 'James', 'surname': 'de Villiers', 'createdAt': new Date()}
        expect(result).toStrictEqual(newUser)
    })
})