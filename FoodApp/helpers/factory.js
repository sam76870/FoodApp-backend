module.exports.createElements = function (ElementModel) {
    return async function (req, res) {
        try {
            let element = req.body;
            if (element) {
                element = await ElementModel.create(element);
                res.status(200).json({
                    element: element
                });
            } else {
                res.status(200).json({
                    message: "kindly enter data"
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}
module.exports.getElements = function (ElementModel) {
    return async function (req, res) {
        try {
            // filter
            // console.log(req.query);
            // sort 
            // remove
            // this is a sample request with query parameters
            // we use ? for refined our query 
            // localhost:8080/api/Element?select=price%name&page=1&sort=price&myquery={"price":{"$gt":200}}
            let ans;
            if (Object.keys(req.query).length) {
                ans = JSON.parse(req.query.myquery);
            } else {
                console.log(ans);
                ans={}
            }
            let ElementQuery = ElementModel.find(ans);
            let sortField = req.query.sort;
            let sortQuery, filteredQuery;
            if (sortField) {
                sortQuery = ElementQuery.sort(`-${sortField}`);
            } else {
                sortQuery = ElementQuery
            }
            if (req.query.select) {
                let params = req.query.select.split("%").join(" ");
                filteredQuery = sortQuery.select(`${params} -_id`);
            } else {
                filteredQuery = sortQuery
            }

            // paginate
            // skip and limit are function of mongoose we use skip and limit for pagination
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 3;
            let toSkip = (page - 1) * limit;
            let paginatedResultPromise = filteredQuery.skip(toSkip).limit(limit);

            let result = await paginatedResultPromise;
            res.status(200).json({
                "message": "list of all the Elements",
                Elements: result
            })
        } catch (err) {
            res.status(500).json({
                error: err.meassage,
                "meassage": "can't get Element"
            })
        }
        // for sending key value pair
        // res.json(Elements);
    }
}
module.exports.updateElements = function (ElementModel) {
    return async function (req, res) {
        let { id } = req.body;
        try {
            let element = await ElementModel.finById(id);
            if (element) {
                delete req.body.id;
                for (let key in req.body) {
                    element[key] = req.body[key];
                }
                await element.save();
                res.status(200).json(element);
            } else {
                res.status(404).json({
                    message: "resource not found"
                })
            }
        } catch {
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}
module.exports.deleteElements = function (ElementModel) {
    return async function (res, res) {
        let { id } = req.body;
        try {
            let element = await ElementModel.finByIdAndDelete(id, req.body);
            if (!element) {
                res.status(404).json({
                    message: "resource not found"
                })
            } else {
                res.status(200).json(element);
            }
        } catch {
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}

module.exports.getElementById = function (ElementModel) {
    return async function (req, res) {
        try {
            let id = req.params.id;
            let element = await ElementModel.getElementById(id);
            res.status(200).json({
                element: element
            });
        } catch {
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}
