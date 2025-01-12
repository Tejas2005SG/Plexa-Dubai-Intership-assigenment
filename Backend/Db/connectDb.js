import mongoose from "mongoose";

export const connectDb = async ()=>{
    try{
        
        const connection = await mongoose.connect(process.env.MONGO_URI);
       

    }catch(err){
        console.log(err.message);
        process.exit(1); 
    }
};



