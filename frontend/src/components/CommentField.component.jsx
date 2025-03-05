import { useContext, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import toast from "react-hot-toast";
import { BlogContext } from "../pages/BlogPage.page";

const CommentField = ({ action }) => {

  const [comment, setComment] = useState("");
  const { userAuth: { access_token, username, fullname, profile_img } } = useContext(UserContext);
  const { blog, blog: { _id, author: { _id: blog_author }, setBlog, comments, activity: { total_comments, total_parent_comments }, setTotalParentsCommentsLoaded } } = useContext(BlogContext);

  

  function handleCommentClick(){
        if (!access_token) {
        return toast.error("Login first to leave a comment");
        }

        if (!comment.length) {
        return toast.error("Write something to leave a comment...");
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", {
            _id, blog_author, comment
          }, {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
          })
          .then(({ data }) => {

            setComment("");

            
            data.commented_by = { 
              personal_info: { username, profile_img, fullname } 
            };
            
            let newCommentArr = [data]; 
            data.childrenLevel = 0;       
            
            let parentCommentIncrementVal = 1;  
            
            setBlog({
              ...blog,
              comments: {
                ...comments,
                results: [...newCommentArr] 
              },
              activity: {
                ...activity,
                total_comments: total_comments || 0 + 1, 
                total_parent_comments: total_parent_comments + parentCommentIncrementVal
              }
            });
            
            setTotalParentsCommentsLoaded(prevVal => prevVal + parentCommentIncrementVal);
            
            
          })
          .catch(err => {
            console.log(err);
          });
          

  }

  return (
    <>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button onClick={handleCommentClick} className="btn-dark mt-5 px-10">{action}</button>
    </>
  );
};

export default CommentField;
