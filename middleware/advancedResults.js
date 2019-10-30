const advancedResults = (model, populate) => async (req, res, next)=>{
    let query;
    //Copy Req.query
    const reqQuery = { ...req.query }

    //Fields to Exclude from query
    const removeFields = ['select', 'sort', 'page', 'limit']
    //Loop over remove fields, delete from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    //Create Query String
    let queryStr = JSON.stringify(reqQuery)

    //Formate qString to have mongoDB operators.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    //Find resource
    query = model.find(JSON.parse(queryStr))

    //SELECT only certain fields.
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query.select(fields)
    }

    //Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = (page * limit)
    const total = await model.countDocuments();
    console.log(total)

    query = query.skip(startIndex).limit(limit)

    if(populate){
        query = query.populate(populate)
    }

    //Execute Query
    const results = await query
    //Pagination Result
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit: limit
        }
    }
    res.advancedResults = {
        success : true, 
        count: results.length, 
        pagination, 
        data: results
    }
    next()
}

module.exports = advancedResults