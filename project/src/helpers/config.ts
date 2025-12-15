let mongoConnOptions = {}

if(process.env.STAGE === "dev"){
    mongoConnOptions = {
        authSource: "admin",
    }
}else if(process.env.STAGE === "prod"){
    mongoConnOptions = {
        authSource: "admin",
    }
}

export const config = {
    mongoURI: process.env.MONGODB_URI || "mongodb://localhost:27017/course-catalog",
    mongoConnOptions,
    serverPort: process.env.PORT || 3000,
}