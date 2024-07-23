import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";


export const createUser = async (req, res, next) => {
    try {

        const { index, name, isActive, registered, age, gender, eyeColor,
            favoriteFruit, title, email, phone, country, address, tags } = req.body;

        if (![name, registered, gender, eyeColor, favoriteFruit,
            title, email, country, address].every((element) => element && element.trim() !== '')) {
            return next(errorHandler(400, "Please provide all the fields"));
        }

        if (![index, age, phone].every((element) => element !== undefined && !isNaN(element))) {
            return next(errorHandler(400, "Please make sure these fields, index, age and phone should be a number"));
        }

        if (typeof isActive !== 'boolean') {
            return next(errorHandler(400, "Please make sure the isActive value must be a boolean"));
        }

        if (!(Array.isArray(tags) && tags.length > 0)) {
            return next(errorHandler(400, "Please provide a valid tags array"));
        }


        const user = await User.findOne({
            index: Number(index),
        });

        if (user) {
            return next(errorHandler(409, `user with the index ${index} already exists!`))
        }

        const newUser = await User.create({
            index, name, isActive, registered, age, gender, eyeColor,
            favoriteFruit,
            company: {
                title,
                email,
                phone,
                location: {
                    country,
                    address
                },
            },
            tags
        });

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'User created successfully',
            newUser
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// Find all the users who are active......
export const activeUsers = async (req, res, next) => {
    try {
        const users = await User.aggregate([
            {
                $match: {
                    isActive: true
                }
            },
            {
                $count: "ActiveUsers"
            },
        ]);

        if (!(Array.isArray(users) && users.length > 0)) {
            return next(errorHandler(404, "No active users exists as of yet!"));
        }

        res.status(200).json({
            success: true,
            message: "Active users found successfully!",
            activeUsers: users[0].ActiveUsers
        })
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// Find the average age of all the users.....
export const getAverageAgeOfUsers = async (req, res, next) => {
    try {
        const avgAge = await User.aggregate([
            {
                $group: {
                    _id: null,
                    avgAgeOfAllUsers: {
                        $avg: "$age"
                    }
                }
            },
        ]);

        const averageAge = Math.floor(avgAge[0].avgAgeOfAllUsers);

        if (!(Array.isArray(avgAge) && avgAge.length > 0)) {
            return next(errorHandler(404, "No active users exists as of yet!"));
        }

        res.status(200).json({
            success: true,
            message: "Average age of all users calculated successfully!",
            averageAge
        })

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// Get the top 5 favourite fruits......
export const getTop5FavouriteFruits = async (req, res, next) => {
    try {

        const favoriteFruits = await User.aggregate(
            [
                {
                    $group: {
                        _id: "$favoriteFruit",
                        totalFruits: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        totalFruits: -1
                    }
                },
                {
                    $limit: 5
                }
            ]
        )

        console.log(favoriteFruits);
        if (!(Array.isArray(favoriteFruits) && favoriteFruits.length > 0)) {
            return next(errorHandler(404, "No active users exists as of yet!"));
        }

        res.status(200).json({
            success: true,
            message: "Top 5 Favourite Fruits of users fetched successfully!",
            favoriteFruits
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// Find the total number of males and females...
export const totalMalesAndFemales = async (req, res, next) => {
    try {
        const genderCounts = await User.aggregate([
            {
                $group: {
                    _id: "$gender",
                    count: { $sum: 1 }
                }
            }
        ]);

        let males = 0;
        let females = 0;

        genderCounts.forEach((gender) => {
            if (gender._id === "male") {
                males = gender.count;
            } else if (gender._id === "female") {
                females = gender.count;
            }
        });

        res.status(200).json({
            success: true,
            message: "Total number of male and female users fetched successfully!",
            males,
            females
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};



// Which country has the highest number of registered users?

export const registeredUser = async (req, res, next) => {
    try {

        const users = await User.aggregate(
            [
                {
                    $group: {
                        _id: "$company.location.country",
                        CountriesCount: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        CountriesCount: -1
                    }
                },
                {
                    $limit: 1
                }
            ]
        );

        res.status(200).json({
            success: true,
            message: "The country with the highest number of registered users fetched successfully!",
            users
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// List all the unique eye colors in the list....


export const uniqueEyeColors = async (req, res, next) => {
    try {

        const uniqueColors = await User.aggregate(
            [
                {
                    $group: {
                        _id: "$eyeColor"
                    }
                }
            ]
        );

        res.status(200).json({
            success: true,
            message: "Unique eye colors fetched successfully!",
            uniqueColors
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// Method 1.................
// export const getAvgNoOFTagsPerUser = async (req, res, next) => {
//     try {

//         const avgTagsPerUser = await User.aggregate(
//             [
//                 {
//                     $unwind : {
//                         path : "$tags",
//                     }
//                 },
//                 {
//                     $group : {
//                         _id : "$_id",
//                         NumberOfTags : {
//                             $sum : 1
//                         }
//                     }
//                 },
//                 {
//                     $group : {
//                         _id : null,
//                         avgTagsPerUser : {
//                             $avg : "$NumberOfTags"
//                         }
//                     }
//                 }

//             ]
//         );

//         res.status(200).json({
//             success: true,
//             message: "Average No of Tags Per User fetched successfully!",
//             avgTagsPerUser
//         });

//     } catch (error) {
//         return next(errorHandler(500, error.message));
//     }
// };


// Method 2...............
export const getAvgNoOFTagsPerUser = async (req, res, next) => {
    try {

        const avgTagsPerUser = await User.aggregate(
            [
                {
                    $addFields: {
                        numberOfTags: {
                            $size: {
                                $ifNull: ["$tags", []]
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgTagsPerUser: {
                            $avg: "$numberOfTags"
                        }
                    }
                }
            ]
        );

        res.status(200).json({
            success: true,
            message: "Average No of Tags Per User fetched successfully!",
            avgTagsPerUser
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// How many users have 'enim' as one of the tags.........

export const getUsersWithEnimTag = async (req, res, next) => {
    try {
        const usersWithEnimTag = await User.aggregate(
            [
                {
                    $match: {
                        // Method 1
                        tags: "dolore"

                        // OR

                        // Method 2
                        // tags : {
                        //     $in : ["enim", "$tags"]
                        // }

                    }
                },
                {
                    $count: "TotalUsers",
                }
            ]
        );

        res.status(200).json({
            success: true,
            message: "Users with enim tag fetched successfully!",
            usersWithEnimTag
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// What are the names and age of all the users who are inActive and have 'velit' as a tag?


export const getUsersData = async (req, res, next) => {
    try {
        const inactiveUsersWithVelitTag = await User.aggregate(
            [
                {
                    $match: {
                        isActive: false,
                        tags: 'velit'
                    }
                },
                {
                    $project: {
                        name: 1,
                        age: 1,
                        // isActive: 1,
                        // tags: 1
                    }
                }
            ]
        );

        res.status(200).json({
            success: true,
            message: "Users who are inactive and have velit as a tag fetched successfully!",
            inactiveUsersWithVelitTag
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// How many users have a phone number starting with '+1 (940)'....

export const getUsersWithFormat = async (req, res, next) => {
    try {
        const usersWithThisPhoneNoFormat = await User.aggregate(
            [
                {
                    $match: {
                        'company.phone': {
                            $regex: /^\+1 \(940\)/
                        },
                    }
                },
                {
                    $count: "UserWithThisPhoneNoFormat"
                }
            ]
        );

        res.status(200).json({
            success: true,
            message: "Users whos phone number starts with '+1 (940)' fetched successfully!",
            usersWithThisPhoneNoFormat
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};



// Controller for setting up pagination........

export const usersPagination = async (req, res, next) => {
    try {

        let { limit = 10, pageNo } = req.query;

        limit = parseInt(limit);
        pageNo = parseInt(pageNo);

        const options = {
            page: pageNo,
            limit: limit,
        };

        const allUsersAggregate = User.aggregate(
            [
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]
        );

        const allUsers = await User.aggregatePaginate(allUsersAggregate, options);

        res.status(200).json({
            success: true,
            message: "All Users fetched successfully with pagination!",
            AllUsers: allUsers.docs,
            totalPages: allUsers.totalPages
        });


    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};




export const getAllUsers = async (req, res, next) => {
    try {

        const allUsers = await User.find({});

        res.status(200).json({
            success: true,
            message: "All Users fetched successfully with pagination!",
            allUsers
        });


    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};



// Setting Up Pagination using skip and limit operators................................
export const usersPaginationUsingSkipAndLimit = async (req, res, next) => {
    try {
        let { limit = 10, pageNo = 1 } = req.query;

        limit = parseInt(limit);
        pageNo = parseInt(pageNo);

        const skip = (pageNo - 1) * limit;

        const options = {
            skip: skip,
            limit: limit,
        };

        const allUsers = await User.find({}).skip(options.skip).limit(options.limit);

        res.status(200).json({
            success: true,
            message: "All Users fetched successfully with pagination!",
            allUsers
        });
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// Who has registered most recently.....

export const mostRecentlyRegistered = async (req, res, next) => {
    try {
        const mostRecentUser = await User.aggregate(
            [
                {
                    $sort: {
                        registered: -1
                    }
                },
                {
                    $limit: 1
                },
                {
                    $project: {
                        name: 1,
                        registered: 1,
                        favoriteFruit: 1
                    }
                }
            ]
        );

        res.status(200).json({
            success: true,
            message: "Most Recent User fetched successfully!",
            mostRecentUser
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// Categorize users by their favourite fruit.....

export const categorizeByFruit = async (req, res, next) => {
    try {
        const OrderByFruit = await User.aggregate(
            [
                {
                    $group: {
                        _id: "$favoriteFruit",
                        noOfUsers: {
                            $push: "$name"
                        }
                    }
                }
            ]
        );


        res.status(200).json({
            success: true,
            message: "User categorized by fruit successfully!",
            OrderByFruit
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

// How many users have 'ad' as second tag in their list of tags?..........

export const getUserWithTagAD = async (req, res, next) => {
    try {
        const allUserwithTag = await User.aggregate(
            [
                {
                    $match: {
                        "tags.1": "ad"
                    }
                },
                {
                    $count: "users"
                }
            ]
        );


        res.status(200).json({
            success: true,
            message: "Users who have ad as the second tag in their list of tags fetched successfully!",
            allUserwithTag
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// Find Users who have both enim and id as their tags?......

export const getUserWithEnimeAndIdTag = async (req, res, next) => {
    try {

        // Method 1 : using $and operator......
        // const userWithEnimIdTg = await User.aggregate(
        //     [
        //         {
        //             $match : {
        //                 $and : [
        //                     {
        //                         tags : "enim"
        //                     },
        //                     {
        //                         tags : "id"
        //                     }
        //                 ]
        //             }
        //         },
        //         {
        //             $count : "totalUsers"
        //         }
        //     ]
        // );

        // Method 2 : using $all operator......

        const userWithEnimIdTg = await User.aggregate(
            [
                {
                    $match: {
                        tags: {
                            $all: ["enim", "id"]
                        }
                    }
                },
                // {
                //     $count : "totalUsers"
                // }
            ]
        );


        res.status(200).json({
            success: true,
            message: "Users who have enim and id tags in their list of tags fetched successfully!",
            userWithEnimIdTg
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// List all the comapnies located in USA with their correponding user count?....

export const getCompaniesInUSA = async (req, res, next) => {
    try {
        const totalCompaniesInUSA = await User.aggregate(
            [
                {
                    $match: {
                        "company.location.country": "USA",
                    }
                },
                {
                    $group: {
                        _id : "$company.title",
                        userCount : {
                            $sum : 1
                        }
                    }
                }
            ]
        );


        res.status(200).json({
            success: true,
            message: "Companies in USA with user count fetched successfully!",
            totalCompaniesInUSA
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};