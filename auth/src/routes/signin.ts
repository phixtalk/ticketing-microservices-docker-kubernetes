import express from "express";

const router = express.Router();

router.post('/api/users/signin', (res, req) => {
    req.send('Hi there!');
});

export { router as signinRouter }