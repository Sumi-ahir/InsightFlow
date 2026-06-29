import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI environment variable are not define!');
    process.exit(1);
}

if(!process.env.JWT_SECRET){
    throw new Error('JWT_SECRET is not defined in environment variable!')
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error('GOOGLE_CLIENT_ID is not defined in environment variable!')
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error('GOOGLE_CLIENT_SECRET is not defined in environment variable!')

}
export const config={
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    NODE_ENV: process.env.NODE_ENV,
     BACKEND_URL: process.env.BACKEND_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,

}
