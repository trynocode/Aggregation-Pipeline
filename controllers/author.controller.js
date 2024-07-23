import { Author } from "../models/authors.model.js";
import {errorHandler} from "../utils/error.js";

export const createAuthor = async (req, res, next) => {
    try {

        const { name, birth_year } = req.body;

        const author = await Author.findOne({
            name: {
                $regex: new RegExp(name, "i")
            }
        });

        if (author) {
            return next( errorHandler(409,`Author with this name ${name} already exists!`))
        }

        const newAuthor = await Author.create({
            name, birth_year
        });

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Author created successfully',
            newAuthor
        });

    } catch (error) {
        return next(errorHandler(500,error.message));
    }
};




export const getAllAuthors = async (req, res, next) => {
    try {
        const authors = await Author.find({});

        if (!(Array.isArray(authors) || authors.length === 0)) {
            return next(errorHandler(404,`No author exists as of yet!`));
        }

        res.status(201).json({
            success: true,
            statusCode: 200,  
            message: 'All Authors fetched successfully',
            authors
        });

    } catch (error) {
        return next(errorHandler(500,error.message));
    }
};


