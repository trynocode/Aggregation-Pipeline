import express from 'express';
import { createBook, getAllBooks, getBook, groupBooks,addNewFields,groupWithPriceQuantity, createMultipleBooks } from '../controllers/book.controller.js';

const router = express.Router();

// User Routes...
router.post("/create-book", createBook);
router.post("/create-multiple-books", createMultipleBooks);


router.get("/allbooks", getAllBooks);
// router.get("/my-books", getMyBooks);
router.get("/findbook/:id", getBook);

router.get("/group-books", groupBooks);

router.post("/add-new-fields", addNewFields);

router.get("/group-with-price-quantity", groupWithPriceQuantity);







export default router;
