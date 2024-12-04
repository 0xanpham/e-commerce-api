import request from "supertest";
import { app } from "../src";
import { Server } from "http";

let server: Server;

describe("Test", function () {
  beforeAll((done) => {
    // Start the server if necessary
    server = app.listen();
    done();
  });

  it("Get /health", async function () {
    const response = await request(app.app).get("/health");
    expect(response.status).toBe(200);
    expect(response.text).toEqual("Server is running");
  });

  afterAll((done) => {
    // Close the server after the tests
    server.close();
    done();
  });
});
