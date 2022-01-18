import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
    var signin: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'aslakjdn';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    //resets all data between each tests that we run
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    //stop and close mongodb connection
    await mongo.stop();
    await mongoose.connection.close();
});

/*
When the app sends back a response with header of Set-Cookie, 
the browser/postman, automatically sets a cookie and includes it 
in future requests.
However in a test environment, we have to make the cookie available globally 
so it can manually set in the post/get requests for authentication
*/
global.signin = async () => {
    const email = 'tests@mail.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({ email, password })
        .expect(201)

    const cookie = response.get('Set-Cookie');

    return cookie;
};