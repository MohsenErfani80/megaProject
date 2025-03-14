const messages = {};

module.exports = new class transforms{

    create(response, data, message){
        return response.status(201).json({
            status: 201,
            success: true,
            message: message,
            data: data
        });
    }

    unAuthorized(response, message){
        return response.status(401).json({
            status: 401,
            success: false,
            message: message,
        });
    }


    success(response,data, message){
        return response.status(200).json({
            status: 200,
            success: true,
            message: message,
            data: data
        });
    }

    notLogin(response,data){
        return response.status(403).json({
            status: 403,
            success: false,
            message: messages[403],
            data: data
        });
    }

    conflict(response, message){
        return response.status(409).json({
            status: 409,
            success: false,
            message: message,
          
        });
    }

    invalidToken(response,data){
        return response.status(401).json({
            status: 401,
            success: false,
            message: messages[401],
            data: data
        });
    }

    invalidData(response,messages,field){       
        return response.status(400).json({
            status: 400,
            success: false,
            message: messages,
            field: field
        });
    }

    internalServerError(res){
        return res.status(500).json({
            status: 500,
            message: "Error"
        })
    }

    notFound(response, message) {
        return response.status(404).json({
            status: 404,
            success: false,
            message: message,
            
        });
    }


    Forbidden(response, message){
        return response.status(403).json({
            status: 403,
            message: message,
            success: false
        })
    }
}