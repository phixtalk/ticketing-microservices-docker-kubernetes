import express from "express";

const router = express.Router();

router.get('/api/users/currentuser', (res, req) => {
    req.send('Hi there!');
});

export { router as currentUserRouter }