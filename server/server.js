import express from 'express';
import dotenv from 'dotenv/config';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import User from './Schema/User.js';
import Blog from './Schema/Blog.js';
import connectDB from './lib/db.js';
import multer from 'multer';
import cloudinary from './lib/cloudinary.js';


const upload = multer()
const PORT = 3000;
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,3}$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));



const verifyJWT = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({ error: "No access token" });
    }

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {

        if (err) {
            return res.status(403).json({ error: "Access token is invalid" });
        }

        req.user = user.id;
        next();

    });
};

const generateUsername = async (email) => {

    let username = email.split("@")[0];

    let isUsernameNotUnique = await User.find({ "personal_info.username": {$exists: true} });
                                
    username += isUsernameNotUnique ? nanoid().substring(0, 5) : "";

    return username;
};

const formatDataToSend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);
    
    return {
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
        access_token
    };
};



app.get("/trending-blogs", (req, res) => {
    Blog.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
        .select("blog_id title publishedAt -_id")
        .limit(5)
        .then(blogs => {
            return res.status(200).json({ blogs });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

app.get('/latest-blogs', (req, res) => {

    Blog.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .then(blogs => {
            return res.status(200).json({ blogs });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});


app.post("/get-profile", (req, res) => {

    let { username } = req.body;

    User.findOne({ "personal_info.username": username })
        .select("-personal_info.password -google_auth -updatedAt -blogs")
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: err.message });
        });
});

app.post("/search-users", (req, res) => {

    const { query } = req.body;

    User.find({ "personal_info.username": new RegExp(query, 'i') })
        .limit(50)
        .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
        .then(users => {
            return res.status(200).json({ users });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});


app.post('/upload', upload.single('img'), async (req, res) => {

    const image = req.file;
    try {

        if(!image){
            return res.status(500).json({error: "Upload an image"});
        }

        const base64String = `data:${image.mimetype};base64,` + req.file.buffer.toString('base64');
        const result = await cloudinary.uploader.upload(base64String);

        return res.status(200).json({url: result.secure_url});

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
    
})

app.post("/signup", async (req, res) => {
    let { fullname, email, password } = req.body;

    // Validating the data from frontend
    if (fullname.length < 3) {
        return res.status(403).json({ "error": "Fullname must be at least 3 letters long" });
    }
    if (!email.length) {
        return res.status(403).json({ "error": "Enter Email" });
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Email is invalid" });
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter" });
    }

    let username = await generateUsername(email);

    bcrypt.hash(password, 10, async (err, hashed_password) => {
        if (err) {
            return res.status(500).json({ "error": "Error hashing password" });
        }

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        });

        user.save()
            .then((user) => {
                return res.status(200).json(formatDataToSend(user));
            })
            .catch((err) => {
                if (err.code === 11000) {
                    return res.status(500).json({ "error": "Email already exists" });
                }
                return res.status(500).json({ "error": err.message });
            });

    });


});

app.post("/signin", (req, res) => {
    //todo
    let { email, password } = req.body;

    User.findOne({ "personal_info.email": email })
        .then((user) => {
            if (!user) {
                return res.status(403).json({ "error": "Email not found" });
            }

            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(403).json({ "error": "Error occurred while logging in, please try again" });
                }

                if (!result) {
                    //todo:
                    return res.status(403).json({ "error": "Incorrect password" });
                } else {
                    return res.status(200).json(formatDataToSend(user));
                }

            });
        })
        .catch((err) => {

            console.log(err);
            return res.status(500).json({ "error": err.message });

        });
});

app.post('/create-blog', [verifyJWT, upload.single('banner')], async (req, res) => {

    const authorId = req.user;
    
    let { title, description, tags, content, draft } = req.body;

    tags = JSON.parse(tags);
    content = JSON.parse(content);
    draft = JSON.parse(draft);


    const bannerBase64String = `data:${req.file.mimetype};base64,` + req.file.buffer.toString('base64');

    //Validation
    {
        if (!title.length) {
            return res.status(403).json({ error: "You must provide a title to publish the blog" });
        }
    
        if(!draft){

                if (!description.length || description.length > 200) {
                    return res.status(403).json({ error: "You must provide blog description under 200 characters" });
                }
            
                if (!bannerBase64String.length) {
                    return res.status(403).json({ error: "You must provide blog banner to publish it" });
                }
            
                if (!content.blocks.length) {
                    return res.status(403).json({ error: "There must be some blog content to publish it" });
                }
            
                if (!tags.length || tags.length > 10) {
                    return res.status(403).json({ error: "Provide tags in order to publish the blog, Maximum 10" });
                }

        }
    }

    tags = tags.map(tag => tag.toLowerCase());


    let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();

    const uploadResponse = await cloudinary.uploader.upload(bannerBase64String);


    let blog = new Blog({
        title, 
        description, 
        banner: uploadResponse.secure_url, 
        content, 
        tags, 
        author: authorId, blog_id, 
        draft: Boolean(draft),
    });

    blog
        .save()
        .then(blog => {

                let incrementVal = draft ? 0 : 1;

                User.findOneAndUpdate(
                    { _id: authorId },
                    { $inc: { "account_info.total_posts": incrementVal }, $push: { "blogs": blog.id } }
                )
                .then(user => {
                    return res.status(200).json({ id: blog.blog_id });
                })
                .catch(err => {
                    return res.status(500).json({ error: "Failed to update total posts number" });
                });

        })
        .catch((err) => {
            return res.status(500).json("error: ", err.message);
        })

});

app.post("/search-blogs", (req, res) => {

    const { tag } = req.body;
    const { query } = req.body;
    const { author } = req.body;
    
    const maxLimit = 5;
    let filterQuery = { };

    console.log(typeof query);
    
    //This is for clicking on the categories section and then rendering.
    if(tag){
        filterQuery.tags = tag;
    }

    if(query){
        filterQuery.$or = [
            { title: { $regex: query, $options: "i" } },
            { blog_id: { $regex: query, $options: "i" } },
            { tags: { $in: new RegExp(query, 'gi') } },
        ]
    }

    if(author){
        filterQuery.author = author;
    }
    
    Blog.find(filterQuery)
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .limit(maxLimit)
        .then(blogs => {
            return res.status(200).json({ blogs });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });

});



app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
    connectDB();
});
