import express from 'express';
import { createUser, activeUsers, getAverageAgeOfUsers, getTop5FavouriteFruits, 
    totalMalesAndFemales, registeredUser, uniqueEyeColors, getAvgNoOFTagsPerUser,
    getUsersWithEnimTag, getUsersData, getUsersWithFormat, usersPagination, getAllUsers,
    usersPaginationUsingSkipAndLimit, mostRecentlyRegistered, categorizeByFruit,
    getUserWithTagAD, getUserWithEnimeAndIdTag, getCompaniesInUSA } from '../controllers/user.controller.js';

const router = express.Router();

// User Routes...
router.post("/create-user", createUser);
router.get("/active-users", activeUsers);
router.get("/avg-age-users", getAverageAgeOfUsers);
router.get("/get-top5-favourite-fruits", getTop5FavouriteFruits);
router.get("/get-total-males-and-females", totalMalesAndFemales);
router.get("/get-country-with-highest-users", registeredUser);
router.get("/get-unique-eye-colors", uniqueEyeColors);

router.get("/avg-no-of-tags-per-user", getAvgNoOFTagsPerUser);
router.get("/users-with-enim-tag", getUsersWithEnimTag);
router.get("/users-inactive-with-velit-tag", getUsersData);
router.get("/users-phone-format", getUsersWithFormat);

// Setting Up Pagination for users.....

router.get("/all-users", usersPagination );
router.get("/get-all-users", getAllUsers );
router.get("/all-users-skip-limit", usersPaginationUsingSkipAndLimit );
router.get("/most-recently-registered", mostRecentlyRegistered );
router.get("/categorize-user-by-fruit", categorizeByFruit );
router.get("/users-with-ad-as-second-tag", getUserWithTagAD );
router.get("/users-with-enim-id-tag", getUserWithEnimeAndIdTag );
router.get("/companes-in-usa-with-user-count", getCompaniesInUSA );












export default router;
