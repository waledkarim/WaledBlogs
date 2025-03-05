import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/BlogPage.page";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import axios from "axios";

const BlogInteraction = () => {

  let {
    blog, 
    blog: {
        _id, 
      blog_id, 
      activity, 
      activity: { total_likes, total_comments }, 
      author: { personal_info: { username: author_username } },
      
    }, 
    setBlog,
    isLikedByUser,
    setIsLikedByUser,
    commentsWrapper,
    setCommentsWrapper 
  } = useContext(BlogContext);

  useEffect(() => {
    if (access_token) {
      // make request to server to get like information
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", 
        { _id }, 
        {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        }
      )
      .then(({ data: { result } }) => {
        setIsLikedByUser(Boolean(result));
      })
      .catch(err => {
        console.log(err);
      });
    }
  }, []);
  

  const {userAuth: { username, access_token }} = useContext(UserContext);

  const handleLike = () => {

    if (access_token) {
        // like the blog
        setIsLikedByUser(prevVal => !prevVal);
      
        !isLikedByUser ? total_likes++ : total_likes--;
      
        setBlog({ ...blog, activity: { ...activity, total_likes } });
        console.log("isLikedByUser: ", isLikedByUser);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", 
            { _id, isLikedByUser }, 
            {
              headers: {
                'Authorization': `Bearer ${access_token}`
              }
            }
          )
          .then(({ data }) => {
            console.log(data);
          })
          .catch(err => {
            console.log(err);
          });
          

      } else {
        // not logged in
        toast.error("please login to like this blog");
      }
      

  }

  return (
    <>
        <hr className="border-grey my-2" />

        <div className="flex gap-6">

            <div className="flex gap-3 items-center">

                <button
                    onClick={handleLike}
                    className={
                        "w-10 h-10 rounded-full flex items-center justify-center " +
                        (isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80")
                    }
                >

                    <i className={"fi " + (isLikedByUser ? "fi-sr-heart" : "fi-rr-heart")}></i>

                </button>

                <p className="text-xl text-dark-grey">{total_likes}</p>

            </div>
            <div className="flex gap-3 items-center">

                <button onClick={() => setCommentsWrapper((prevValue) => !prevValue)} className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                    <i className="fi fi-rr-comment-dots"></i>
                </button>
                <p className="text-xl text-dark-grey">{total_comments}</p>

            </div>
            <div className="flex gap-6 items-center">
                {
                    username === author_username ? (
                        <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">
                        Edit
                        </Link>
                    ) : null
                }
            </div>

        </div>

        <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
