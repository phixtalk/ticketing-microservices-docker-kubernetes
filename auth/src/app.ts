import express from 'express';
import 'express-async-errors';//makes sure we don't have to call next() 
//in error handler when throwing errors in async functions
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from "@csticket/common";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();
app.set('trust proxy', true);//because traffic is been proxied to our app via
//ingress nginx, this make express to be aware that it's behind a proxy, and it's
//ok to trust traffic from the proxy
app.use(json());
app.use(
    cookieSession({//this method sets the req.session property
        signed: false,//disable encryption, because json is already encrypted
        secure: process.env.NODE_ENV !== 'test'//if true, cookie will be set only on https, if false, cookie will be set only on http
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

export { app };