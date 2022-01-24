import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
    var signin: () => string[];
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

-- In addition, we don't want to react-out to an external auth service to
get the token, instead we manually generate the token locally and make it
available globally for testing
*/
global.signin = () => {
    //Build a jwt payload. { id, email }
    const payload = {
        id: '19189n23923',
        email: 'test@mail.com'
    };

    //Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    //Build the session Object. { jwt: token }
    const session = { jwt: token };

    //Turn the session object into JSON
    const sessionJSON = JSON.stringify(session);

    //Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    //return a string thats the cookie with the encoded data
    return [`session=${base64}`];
};