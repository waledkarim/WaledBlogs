import connectDB from "../lib/db";
import Blog from "../Schema/Blog";





async function seedDatabase(){
try {
    connectDB();
    await Blog.insertMany();
    
} catch (error) {
    console.log("Error in seeding: ", error);
}
}