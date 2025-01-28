import {apiSuccess } from "../utils/apiSuccess.js"

const healthcheckConteroller= (req,res)=>{
    return apiSuccess(res,200,"healthchecked succesfully", {
        "data": "OK"
    })
    //  apiError(res, 400, "Error in healthcheck")
}

export default healthcheckConteroller;