import { Server } from 'http'
import request from 'supertest'

export async function createUserAndLogin(
  server: Server,
) {
  await request(server)
    .post('/users')
    .send({
      name: 'John',
      email: 'johndoe@gmail.com',
      password: '123456',
    })
    .expect(201)

  const loginResponse = await request(
    server,
  )
    .post('/auth')
    .send({
      email: 'johndoe@gmail.com',
      password: '123456',
    })
    .expect(201)

  const body = loginResponse.body as {
    token: string
  }
  return body.token
}
