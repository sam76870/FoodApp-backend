const express = require('express');
// dependencies
const ReviewRouter = express.Router();
const protectRoute = require("./authHelper");
const ReviewModel = require("../models/reviewModel");
const PlanModel = require("../models/planModel");
const factory = require("../helpers/factory")
const createReview = async function (req, res) {
    try {
        let review = await ReviewModel.create(req.body);
        console.log("Review", review);
        let planId = review.plan;
        let plan = await PlanModel.findById(planId);
        plan.reviews.push(review["_id"]);
        if (plan.averageRating) {
            let sum = plan.averageRating * plan.reviews.length;
            let finalAvgRating = (sum + review.rating) / (plan.review.length + 1)
            plan.averageRating = finalAvgRating;
        }else{
            plan.averageRating = review.rating;
        }
        await plan.save();
        res.status(200).json({
            message: "Review Created",
            review: review
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
const deleteReview = async function (req, res) {
    try {
        let review = await ReviewModel.findById(req.body.id);
        console.log("Review", review);
        let planId = review.plan;
        let plan = await PlanModel.findByIdAndUpdate(planId);
        let idxOfReview = plan.reviews.indexOf(review["_id"]);
        plan.reviews.splice(idxOfReview, 1);
        plan.reviews.push(review["_id"]);
        await plan.save();
        res.status(200).json({
            message: "Review Deleted",
            review: review
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
const getReviews = factory.getElements(ReviewModel);
const updateReview = factory.updateElements(ReviewModel);
const getReviewById = factory.getElementById(ReviewModel);

// ReviewRouter.use(protectRoute);
ReviewRouter
    .route("/")
    .post(createReview)
    // protectRoute, authorizeReview(["admin"])
    .get(getReviews);
// **************************

ReviewRouter
    .route("/:id")
    .get(getReviewById)
    .patch(updateReview)
    .delete(deleteReview);

// cron job -> update result in 5 sec of average rating
// ReviewRouter.route("/top3plans").get(Top3Plans);
// async function Top3Plans() {
//     // review model -> get me  first three the plans decreasing order of rating
//     try {
//         // find Empty -> full model search and you will get all the entries
//         const reviews = await ReviewModel.find().limit(3).sort({
//             rating: -1
//         });
//         res.status(201).json({
//             reviews,
//             message:"Reviews"
//         })

//     } catch (err) {
//         res.status(400).json({
//             err: err.message
//         })
//     }
// }

module.exports = ReviewRouter;
