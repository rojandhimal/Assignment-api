const request = require('supertest');
const app = require('../app/index');


describe("POST /api/v1/auth/login", () => {
  describe("given a email and password", () => {

    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email:"rojandhimal@gmail.com",
        password:"tegsbro"
      })
      expect(response.statusCode).toBe(200)
    })
    test("should respond with a authToken", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email:"rojandhimal@gmail.com",
        password:"tegsbro"
      })
      expect(response.data.authToken).toBeDefined()
    })
    test("should respond with a refreshToken", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email:"rojandhimal@gmail.com",
        password:"tegsbro"
      })
      expect(response.data.refreshToken).toBeDefined()
    })
    test("should specify json in the content type header", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        "email":"rojandhimal@gmail.com",
        "password":"tegsbro"

      })
      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
    })
  })

  describe("when the email and password is missing", () => {
    test("should respond with a status code of 400", async () => {
      const bodyData = [
        {email: "email"},
        {password: "password"},
        {}
      ]
      for (const body of bodyData) {
        const response = await request(app).post("/api/v1/auth/login").send(body)
        expect(response.statusCode).toBe(400)
      }
    })
  })

})


describe("POST /api/v1/auth/signup", () => {
  describe("given a email and password", () => {

    test("should respond with a 201 status code", async () => {
      const response = await request(app).post("/api/v1/auth/signup").send({
        email: `rojan${Math.random()}@gmail.com`,
        password: `tets@1998${Math.random()}`
      })
      expect(response.statusCode).toBe(201)
    })
    test("should specify json in the content type header", async () => {
      const response = await request(app).post("/api/v1/auth/signup").send({
        email: `rojan${Math.random()}@gmail.com`,
        password: `tets@1998${Math.random()}`
      })
      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
    })
  })

  describe("when the email and password is missing", () => {
    test("should respond with a status code of 400", async () => {
      const bodyData = [
        {email: "email"},
        {password: "password"},
        {}
      ]
      for (const body of bodyData) {
        const response = await request(app).post("/api/v1/auth/signup").send(body)
        expect(response.statusCode).toBe(400)
      }
    })
  })

})