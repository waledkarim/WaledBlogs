import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/AnimationWrapper";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/BlogInteraction.component";
import BlogContent from "../components/BlogContent.component";
import CommentsContainer, { fetchComments } from "../components/comments.component";

export const blogStructure = {
    title: '',
    des: '',
    content: [],
    tags: [],
    author: { personal_info: {} },
    banner: '',
    publishedAt: ''
};

export const BlogContext = createContext({});

const BlogPage = () => {

    let { blog_id } = useParams();
    const [blog, setBlog] = useState(blogStructure);
    const [loading, setLoading] = useState(true);
    const [isLikedByUser, setIsLikedByUser] = useState(false);
    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [totalParentsCommentsLoaded, setTotalParentsCommentsLoaded] = useState(true);

    let { title, 
          content,
          tags, 
          banner, 
          author: { personal_info: { fullname, username: author_username, profile_img } }, 
          publishedAt } = blog;

    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
            .then(async ({ data: { blog } }) => {

                console.log("before: ", blog);
                blog.comments = await fetchComments({ 
                    blog_id: blog._id, 
                    setParentCommentCountFun: setTotalParentsCommentsLoaded 
                });
                console.log("after: ", blog);
                  

                setBlog(blog);
                console.log("Clicked blog: ", blog);
                setLoading(false);

            })
            .catch(err => {

                console.log(err);
                setLoading(false);

            });
    };

    useEffect(() => {

        resetStates()
        fetchBlog();

    }, []);

    const resetStates = () => {
        setBlog(blogStructure);
        setLoading(true);
        setIsLikedByUser(false);
        setTotalParentsCommentsLoaded(0);
    };
      

    return (

        <AnimationWrapper>
            {
                loading ? <Loader /> : (

                <BlogContext.Provider value={{blog, setBlog, isLikedByUser, setIsLikedByUser, commentsWrapper, setCommentsWrapper, totalParentsCommentsLoaded, setTotalParentsCommentsLoaded}}>

                    <CommentsContainer />
                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">

                        {/* Blog Banner */}
                        <img src={banner} className="aspect-video" alt="Blog Banner" />

                        <div className="mt-12">

                            {/* Blog Title */}
                            <h2>{title}</h2>

                            <div className="flex max-sm:flex-col justify-between my-8">

                                    <div className="flex gap-5 items-start">
                                        {/* Author Profile Image */}
                                        <img src={profile_img} className="w-12 h-12 rounded-full" alt="Author Profile" />

                                        {/* Author Information */}
                                        <p className="capitalize">
                                            {fullname}
                                            <br />
                                            @
                                            <Link to={`/user/${author_username}`} className="text-blue-500 hover:underline">
                                                {author_username}
                                            </Link>
                                        </p>

                                    </div>
                                    <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                                        Published on {getDay(publishedAt)}
                                    </p>


                            </div>

                        </div>

                        <BlogInteraction />

                        <div className="my-12 font-gelasio blog-page-content">
                            {
                                content?.[0]?.blocks?.map((block, i) => (
                                    <div key={i} className="my-4 md:my-8">
                                      <BlogContent block={block} />
                                    </div>
                                  ))
                            }
                        </div>

                    </div>
                </BlogContext.Provider>
                    
                )
            }
    </AnimationWrapper>

        
    );
};

export default BlogPage;
