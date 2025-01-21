import { sendError,sendSuccess } from "../utils/response.util.js"
const healthcheckConteroller= (req,res)=>{
    // return sendSuccess(res,200,"healthchecked succesfully", {
    //     "data": "OK"
    // })
    return sendError(res, 400, "Error in healthcheck")
}

export default healthcheckConteroller;