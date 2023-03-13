import {describe, test} from "@jest/globals";
import {prismaMock} from '../singleton'
import request from 'supertest'
import app from '../app'
describe('User Controllers, services and repos', () => {

    test('It tests whether a user can be created in the DB', async () => {

        const user = {'id': 'ab', 'name': 'James', 'surname': 'de Villiers'}

        prismaMock.user.create.mockResolvedValue(user)
        const result = await request(app).post('/users').send(user)
        expect(result.status).toBe(200)
    })
})