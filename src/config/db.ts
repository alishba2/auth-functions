import mongoose from "mongoose";

const connect = async () => {
    mongoose.set("strictQuery", true);
    const DBURL = process.env.MONGODB_URL as string;

    await mongoose.connect(DBURL);

 
};

export default connect;

