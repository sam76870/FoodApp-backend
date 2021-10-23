const express = require('express');
const PlanModel = require('../models/planModel');
const PlanRouter = express.Router();
const factory = require("../helpers/factory");
const protectRoute = require("./authHelper");

const createPlan = factory.createElements(PlanModel);
const getPlans = factory.getElements(PlanModel);
const deletePlan = factory.deleteElements(PlanModel);
const updatePlan = factory.updateElements(PlanModel);
const getPlanById = factory.getElementById(PlanModel);
PlanRouter.use(protectRoute);

PlanRouter.route("/top3plans")
.get(Top3Plans);
PlanRouter
.route("/:id")
.get(getPlanById)
.patch(updatePlan)
.delete(deletePlan);
PlanRouter
    .route("/")
    // protectRoute, authorizePlan(["admin"])
    .post(createPlan)
    .get(getPlans)
async function Top3Plans(req,res) {
    // review model -> get me  first three the plans decreasing order of rating
    try {
        // find Empty -> full model search and you will get all the entries
        const plans = await PlanModel.find().limit(3).sort({
            averageRating: -1
        }).populate({ path: 'reviews', select: 'review rating' })
        console.log(plans);
        res.status(200).json({
            plans,
            message: "plans"
        })

    } catch (err) {
        console.log(err);
        res.status(200).json({
            message: err.message
        })
    }
}

// async function createPlan(req, res) {
//     try {
//         let plan = req.body;
//         if (plan) {
//             plan = await PlanModel.create(plan);
//             res.status(200).json({
//                 plan: plan
//             });
//         } else {
//             res.status(200).json({
//                 message: "kindly enter data"
//             });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             message: "Server error"
//         });
//     }
// }
// async function getPlan(req, res) {
//     try {
//         // filter
//         // console.log(req.query);
//         // sort 
//         // remove
//         // this is a sample request with query parameters
//         // we use ? for refined our query 
//         // localhost:8080/api/plan?select=price%name&page=1&sort=price&myquery={"price":{"$gt":200}}
//         let ans = JSON.parse(req.query.myquery);
//         console.log(ans);
//         let planQuery = PlanModel.find(ans);
//         let sortField = req.query.sort;
//         let sortQuery = planQuery.sort(`-${sortField}`);
//         let params = req.query.select.split("%").join(" ");
//         let filteredQuery = sortQuery.select(`${params} -_id`);

//         // paginate
//         // skip and limit are function of mongoose we use skip and limit for pagination
//         let page = Number(req.query.page) || 1;
//         let limit = Number(req.query.limit) || 3;
//         let toSkip = (page - 1) * limit;
//         let paginatedResultPromise = filteredQuery.skip(toSkip).limit(limit);

//         let result = await paginatedResultPromise;
//         res.status(200).json({
//             "message": "list of all the Plans",
//             Plans: result
//         })
//     } catch {
//         res.status(500).json({
//             error: err.meassage,
//             "meassage": "can't get Plan"
//         })
//     }
//     // for sending key value pair
//     // res.json(Plans);
// }
// async function updatePlan(req, res) {
//     try {
//         await PlanModel.updateOne({ name }, req.body);
//         let plan = await PlanModel.findOne({ name });
//         res.status(200).json(Plan);
//     } catch {
//         console.log(err);
//         res.status(500).json({
//             message: "Server error"
//         });
//     }
// }
// async function deletePlan(res, res) {
//     Plan = {};
//     res.status(200).json(Plan);
// }
// async function getPlanById(req, res) {
//     try {
//         let id = req.params.id;
//         let plan = await PlanModel.getElementById(id);
//         res.status(200).json({
//             plan: plan
//         });
//     } catch {
//         res.status(500).json({
//             message: "Server error"
//         });
//     }
// }

module.exports = PlanRouter;