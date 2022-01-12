import express from "express";

const router = express.Router();

router.post('/api/users/signout', (res, req) => {
    req.send('Hi there!');
});

export { router as signoutRouter }