import express from 'express';
import 'express-async-errors';//makes sure we don't have to call next() 
//in error handler when throwing errors in async functions
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set('trust proxy', true);//because traffic is been proxied to our app via
//ingress nginx, this make express to be aware that it's behind a proxy, and it's
//ok to trust traffic from the proxy
app.use(json());
app.use(
    cookieSession({//this method sets the req.session property
        signed: false,//disable encryption, because json is already encrypted
        secure: true//allows cookies to be used only on https connection
    })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.log(error);
    }

    app.listen(3000, () => {
        console.log('Listening at port 3000!');
    });
}

start();