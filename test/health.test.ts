import request from "supertest";
import { app } from "../src";
import { Server } from "http";

let server: Server;

describe("Testing rest api", function () {
  beforeAll((done) => {
    server = app.listen();
    done();
  });

  it("Get /health", async function () {
    const response = await request(app.app).get("/health");
    expect(response.status).toBe(200);
    expect(response.text).toEqual("Server is running");
  });

  afterAll((done) => {
    server.close();
    done();
  });
});
