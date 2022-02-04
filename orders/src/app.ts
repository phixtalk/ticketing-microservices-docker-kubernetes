import express from 'express';
import 'express-async-errors';//makes sure we don't have to call next() 
//in error handler when throwing errors in async functions
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from "@csticket/common";
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';


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

app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app };