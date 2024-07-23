import { Book } from "../models/books.model.js";
import {errorHandler} from "../utils/error.js";



// Syntax:

// { <field>: { $regex: /pattern/, $options: '<options>' } }
// { <field>: { $regex: 'pattern', $options: '<options>' } }
// $options:

// In MongoDB, the following <options> are available for use with regular expression:

// i: To match both lower case and upper case pattern in the string.
// m: To include ^ and $ in the pattern in the match i.e. to specifically search for ^ and $ inside the string. Without this option, these anchors match at the beginning or end of the string.
// x: To ignore all white space characters in the $regex pattern.
// s: To allow the dot character “.” to match all characters including newline characters.

// db.employee.find({Name:{$regex:"^B"}}).pretty()
// Here, we are displaying the documents of those employees whose name starts with ‘B’ letter. 
// So, we pass a regular expression using $regex operator(i.e. {$regex : “^B”}) for the Name field in the find() method.



// Displaying details of the employee whose name ends with e:
// db.employee.find({Name:{$regex:"e$"}}).pretty()
// Here, we are displaying the documents of those employees whose names end with the ‘e’ letter. So, 
// we pass a regular expression using $regex operator(i.e. {$regex : “e$”}) for the Name field in the find() method.




// Displaying details of employee who are having the word “te” in their name by using regular expression object:
// db.employee.find({Name: /te/}).pretty()
// Here, we are displaying the documents of those employees whose names contain the “te” string. So, we
// pass a regular expression(i.e., {Name: /te/}) for the Name field in the find() method. In this regular expression,
//  means to specify your search criteria in between these delimiters, i.e., /te/.

export const createBook = async (req, res, next) => {
    try {

        const { title, genre } = req.body;
        const { authorId } = req.query;

        const book = await Book.findOne({ 
            title : {
                $regex : title,
                $options :  'ix'
            } 
        });

        if (book) {
            return next( errorHandler(409,`Book with this title ${title} already exists!`))
        }

        const newBook = await Book.create({
            title, genre,
            author_id: authorId
        });

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Book created successfully',
            newBook
        });

    } catch (error) {
        return next(errorHandler(500,error.message));
    }
};


export const getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find({});

        if (!(Array.isArray(books) || books.length === 0)) {
            return next(errorHandler(404,`No books exists as of yet!`));
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'All Books fetched successfully',
            books
        });

    } catch (error) {
        return next(errorHandler(500,error.message));
    }
};


export const getBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        if(!id){
            return next( errorHandler(400,`Id is required!`));
        }
        console.log(id);
        const data = await Book.aggregate(
            [
                {
                    $match: {
                        _id: id
                    }
                },

                // Method 1 : Nesting pipeline...

                // {
                //     $lookup: {
                //         from: "authors",
                //         localField: "author_id",
                //         foreignField: "_id",
                //         as: "author_details",
                //         pipeline : [
                //             {
                //                 $addFields : {
                //                     "author_details": {
                //                         $arrayElemAt : ["$author_details",0]
                //                     }
                //                 }
                //             }
                //         ]
                //     }
                // },


                // Method 2 : Using $first with $addFields .....

                // {
                //     $lookup: {
                //         from: "authors",
                //         localField: "author_id",
                //         foreignField: "_id",
                //         as: "author_details",
                //     }
                // },
                // {
                //     $addFields : {
                //         "author_details": {
                //             $first : "$author_details",
                //         }
                //     }
                // }


                // Method 2 : Using $arrayElemAt with $addFields....

                {
                    $lookup: {
                        from: "authors",
                        localField: "author_id",
                        foreignField: "_id",
                        as: "author_details",
                    }
                },
                {
                    $addFields: {
                        "author_details": {
                            $arrayElemAt: ["$author_details", 0],
                        }
                    }
                }

                // Method 4 : Using unwind........
                // unwind method flattens the array and creates a new seperate document for each element in the array.......
                // {
                //     $unwind: {
                //         path: '$author_details',
                //         preserveNullAndEmptyArrays: true
                //     }
                // }
            ]
        );

        if(!data){
            return next( errorHandler(404,`Book with this Id ${id} exists!`))
        }
        console.log(data);

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        return next(errorHandler(500,error.message));
    }
};


export const groupBooks = async (req, res, next) => {
    try {
        let books = await Book.aggregate(
            [
                {
                    $group: {
                        _id: "$genre",
                        totalBooks: {
                            $sum: 1
                        }
                    }
                },
            ]
        );

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'All Books grouped successfully',
            books
        });

    } catch (error) {
        return next(errorHandler(500,error.message));
    }
};



export const addNewFields = async (req, res, next) => {
    try {

        const { price, quantity } = req.body;
        await Book.updateMany({}, {
            $set: {
                price,
                quantity
            }
        })

        res.status(201).json({
            success: true,
            statusCode: 200,
            message: `Fields ${price} and ${price} added successfully`,
        });

    } catch (error) {
        return next(errorHandler(500,error.message));
    }
};



export const groupWithPriceQuantity = async (req, res, next) => {
    try {

        // let books = await Book.aggregate([
        //     {
        //         $group: {
        //             _id: "$_id",
        //             totalPrice: {
        //                 $sum: {
        //                     $multiply: ["$price", "$quantity"],
        //                 }
        //             }
        //         }
        //     },
        //     {
        //         $sort:{
        //             totalPrice: 1
        //         }
        //     }
        // ])


        let books = await Book.aggregate([
            {
                $group: {
                    _id: "$genre",
                    totalPrice: {
                        $sum: {
                            $multiply: ["$price", "$quantity"],
                        }
                    }
                }
            },
            {
                $sort:{
                    totalPrice: 1
                }
            }
        ])

        res.status(201).json({
            success: true,
            statusCode: 200,
            message: `Books grouped with price and quantity successfully`,
            books
        });

    } catch (error) {
        return next(errorHandler(500,error.message));
    }
};



// For Creating multiple books........


// Method 1
// export const createMultipleBooks = async (req, res, next) => {
//     try {
//         const booksList = req.body;

//         if (!Array.isArray(booksList)) {
//             throw new Error('Request body must be an array of booksList');
//         }

//         const bookCheckPromises = booksList.map(book =>
//             Book.findOne({
//                 title: {
//                     $regex: new RegExp(book.title, "i")
//                 }
//             }).then(existingBook => {
//                 if (existingBook) {
//                     throw new Error(`Book with name "${book.title}" already exists`);
//                 }
//             })
//         );

//         await Promise.all(bookCheckPromises);

//         const createdBooks = await Book.insertMany(booksList);

//         res.status(201).json({
//             success: true,
//             statusCode: 201,
//             message: 'Multiple Books created successfully',
//             createdBooks
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// Method 2

export const createMultipleBooks = async (req, res, next) => {
    try {
        const booksList = req.body;

        if (!(Array.isArray(booksList) && booksList.length > 0)) {
            return next( errorHandler(400,`Request body must be a valid and non-empty array`));
        }

        // Using a Set to keep track of duplicate author names in the input list
        const uniqueNames = new Set();

        // First, check for duplicates in the provided list
        for (const book of booksList) {
            if (uniqueNames.has(book.title)) {
            return next(errorHandler(409,`Duplicate book title "${book.title}" in the input list`));
            }
            uniqueNames.add(book.title);
        }

        // Check for existing authors in the database
        for (const book of booksList) {
            const existingBook = await Book.findOne({
                title: {
                    $regex: new RegExp(book.title, "i") // Case-insensitive search
                }
            });

            if (existingBook) {
            return next(errorHandler(409,`Book with title "${book.title}" already exists in the database`));
            }
        }

        // Insert new authors
        const createdBooks = await Book.insertMany(booksList);

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Multiple books created successfully',
            createdBooks
        });
    } catch (error) {
        return next(errorHandler(500,error.message));
    }
};



