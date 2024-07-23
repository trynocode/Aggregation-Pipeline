import express from 'express';
import { createAuthor, getAllAuthors } from '../controllers/author.controller.js';

const router = express.Router();

// User Routes...
router.post("/create-author", createAuthor);
router.get("/allauthors", getAllAuthors);
// router.get("/profile", myProfile);
// router.get("/author/:id", getAuthor);




export default router;
