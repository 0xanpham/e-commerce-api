import request from "supertest";
import { Server } from "http";
import { App } from "../src/app";
import {
  MongoDBContainer,
  StartedMongoDBContainer,
} from "@testcontainers/mongodb";
import mongoose from "mongoose";
import { verifyToken } from "../src/services/auth";
import { IUser, Role } from "../src/models/user";
import { updateInventory } from "../src/services/inventory";
import { IInventory } from "../src/models/inventory";

let server: Server;
let app: App;
let mongodbContainer: StartedMongoDBContainer;
let token: string;
let token2: string;
let user: IUser;
let user2: IUser;

jest.setTimeout(120 * 1000);

async function setup() {
  mongodbContainer = await new MongoDBContainer("mongo:8.0.3").start();
  const connectionString = mongodbContainer.getConnectionString();
  app = new App(8000, `${connectionString}?directConnection=true`);
  server = app.listen();
}

async function cleanup() {
  server.close();
  await mongoose.disconnect();
  await mongodbContainer.stop();
}

beforeAll(async () => {
  await setup();
});

afterAll(async () => {
  await cleanup();
});

describe("Server health", function () {
  it("Server is running healthy", async function () {
    const response = await request(app.app).get("/health");
    expect(response.status).toBe(200);
    expect(response.text).toEqual("Server is healthy");
  });
});

describe("Sign up", function () {
  it("Invalid dto format", async function () {
    let response = await request(app.app).post("/auth/sign-up").send({
      username: "joe-rogan",
      password: "123456",
    });
    expect(response.status).toBe(400);
    let jsonResponse = JSON.parse(response.text);
    expect(jsonResponse.message).toEqual(
      "username must contain alphanumeric characters"
    );

    response = await request(app.app).post("/auth/sign-up").send({
      username: "joerogan",
      password: "123-456",
    });
    expect(response.status).toBe(400);
    jsonResponse = JSON.parse(response.text);
    expect(jsonResponse.message).toEqual(
      "password must contain alphanumeric characters"
    );

    response = await request(app.app).post("/auth/sign-up").send({
      username: "joerogan",
      password: "123",
    });
    expect(response.status).toBe(400);
    jsonResponse = JSON.parse(response.text);
    expect(jsonResponse.message).toEqual(
      "password must be at least 6 characters"
    );
  });

  it("Sign up successfully with valid token", async function () {
    let response = await request(app.app).post("/auth/sign-up").send({
      username: "joerogan",
      password: "123456",
    });
    expect(response.status).toBe(201);
    let jsonResponse = JSON.parse(response.text);
    token = jsonResponse.accessToken;
    expect(token).not.toBeNull();
    expect(verifyToken(token)).toMatchObject<IUser>({
      username: "joerogan",
      role: Role.Customer,
    });

    response = await request(app.app).post("/auth/sign-up").send({
      username: "iangarry",
      password: "123456",
    });
    jsonResponse = JSON.parse(response.text);
    token2 = jsonResponse.accessToken;
  });

  it("Duplicated username while signing up", async function () {
    let response = await request(app.app).post("/auth/sign-up").send({
      username: "joerogan",
      password: "12345678",
    });
    expect(response.status).toBe(400);
    let jsonResponse = JSON.parse(response.text);
    expect(jsonResponse.message).toEqual("user is already existed");
  });
});

describe("Sign in", function () {
  it("Invalid dto format", async function () {
    let response = await request(app.app).post("/auth/sign-in").send({
      username: "joe-rogan",
      password: "123456",
    });
    expect(response.status).toBe(400);
    let jsonResponse = JSON.parse(response.text);
    expect(jsonResponse.message).toEqual(
      "username must contain alphanumeric characters"
    );

    response = await request(app.app).post("/auth/sign-in").send({
      username: "joerogan",
      password: "123-456",
    });
    expect(response.status).toBe(400);
    jsonResponse = JSON.parse(response.text);
    expect(jsonResponse.message).toEqual(
      "password must contain alphanumeric characters"
    );

    response = await request(app.app).post("/auth/sign-in").send({
      username: "joerogan",
      password: "123",
    });
    expect(response.status).toBe(400);
    jsonResponse = JSON.parse(response.text);
    expect(jsonResponse.message).toEqual(
      "password must be at least 6 characters"
    );
  });

  it("Username does not exist", async function () {
    let response = await request(app.app).post("/auth/sign-in").send({
      username: "danawhite",
      password: "123456",
    });
    expect(response.status).toBe(400);
    let jsonResponse = JSON.parse(response.text);
    expect(jsonResponse.message).toEqual("user does not exist");
  });

  it("Wrong password", async function () {
    let response = await request(app.app).post("/auth/sign-in").send({
      username: "joerogan",
      password: "12345678",
    });
    expect(response.status).toBe(400);
    let jsonResponse = JSON.parse(response.text);
    expect(jsonResponse.message).toEqual("wrong password");
  });

  it("Sign in successfully with valid token", async function () {
    let response = await request(app.app).post("/auth/sign-in").send({
      username: "joerogan",
      password: "123456",
    });
    expect(response.status).toBe(200);
    let jsonResponse = JSON.parse(response.text);
    token = jsonResponse.accessToken;
    expect(token).not.toBeNull();
    user = verifyToken(token);
    expect(user).toMatchObject<IUser>({
      username: "joerogan",
      role: Role.Customer,
    });
    user2 = verifyToken(token2);
  });
});

describe("Inventory", function () {
  beforeAll(async () => {
    await updateInventory(user._id!, "product_id_0", "Product 0", 10, "image0");
    await updateInventory(user._id!, "product_id_1", "Product 1", 20, "image1");
    await updateInventory(user._id!, "product_id_0", "Product 0", 30, "image0");
  });

  it("Unauthorized inventories request", async function () {
    let response = await request(app.app)
      .get(`/inventories/${user._id}`)
      .set("Authorization", token2);
    expect(response.status).toBe(401);
    let jsonResponse = JSON.parse(response.text);
    expect(jsonResponse.message).toEqual(
      "user can only view his/her own inventory"
    );
  });

  it("Get user inventories successfully", async function () {
    let response = await request(app.app)
      .get(`/inventories/${user._id}`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    let jsonResponse = JSON.parse(response.text);
    expect(jsonResponse.inventories).toHaveLength(2);
    expect(jsonResponse.inventories[0]).toMatchObject<Partial<IInventory>>({
      userId: user._id!,
      productId: "product_id_0",
      quantity: 40,
      productName: "Product 0",
      image: "image0",
    });
    response = await request(app.app)
      .get(`/inventories/${user2._id}`)
      .set("Authorization", token2);
    jsonResponse = JSON.parse(response.text);
    expect(jsonResponse.inventories).toHaveLength(0);
  });
});
