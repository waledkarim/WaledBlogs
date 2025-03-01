import { toast } from "react-hot-toast";
import AnimationWrapper from "../common/AnimationWrapper";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import { UserContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PublishForm = () => {

    const characterLimit = 200;
    const tagLimit = 10;

    let { blog, blog: { banner, title, tags, description, content }, setEditorState, setBlog } = useContext(EditorContext);
    const { userAuth: { access_token } } = useContext(UserContext);

    const navigate = useNavigate();

    const handleCloseEvent = () => {
        setEditorState("editor");
    };

    const handleBlogTitleChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, title: input.value });
    };

    const handleBlogDesChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, description: input.value });
    };

    const handleKeyDown = (e) => {
      const { key } = e;
      if(key === 'Enter'){
        e.preventDefault();
      }
    }

    const handleTagKeyDown = (e) => {

      if(e.keyCode == 13 || e.keyCode === 188){

          e.preventDefault();

          const { value } = e.target;

          if(tags.length < tagLimit){

            if(!tags.includes(value) && value.length){
                setBlog({...blog, tags: [...tags, value]});
              }
              
            }else{
              return toast.error("You can add upto 10 tags");
            }
            
          e.target.value = "";
          
      }

    }

    const handlePublishClick = (e) => {

      //Validation
      {
          if (!title.length) {
            return toast.error("Write blog title before publishing");
          }
      
          if (!description.length || description.length > characterLimit) {
              return toast.error(`Write a description about your blog within ${characterLimit} characters to publish`);
          }
      
          if (!tags.length) {
              return toast.error("Enter at least 1 tag to help us rank your blog");
          }
      }
  
      let loadingToast = toast.loading("Publishing....");
      e.target.classList.add("disable");
  
      let blogObj = {
          title,
          banner,
          description,
          content,
          tags,
          draft: false
      };

      let file = base64ToFile(banner, "image.png");
    
      console.log(file); // File object
  
    //   axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
    //       headers: {
    //           "Authorization": `Bearer ${access_token}`
    //       }
    //   })
    //   .then(() => {
    //         e.target.classList.remove("disable");
    
    //         toast.dismiss(loadingToast);
    //         toast.success("Published 👍");
    
    //         setTimeout(() => {
    //             navigate("/");
    //         }, 2000);
    //   })
    //   .catch(({ response }) => {

    //       e.target.classList.remove("disable");
    //       toast.dismiss(loadingToast);
    //       return toast.error(response.data.error);

    //   });

    };

    function base64ToFile(base64String, fileName) {
        // Split the base64 string to get the mime type and the actual base64 data
        let arr = base64String.split(',');
        let mimeMatch = arr[0].match(/:(.*?);/);
        let mime = mimeMatch ? mimeMatch[1] : 'image/png'; // Default to PNG if mime type is unknown
    
        // Decode the base64 string
        let byteString = atob(arr[1]);
    
        // Create an array buffer
        let arrayBuffer = new ArrayBuffer(byteString.length);
        let uint8Array = new Uint8Array(arrayBuffer);
    
        // Fill the array buffer with binary data
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
    
        // Create a Blob with the appropriate mime type
        let blob = new Blob([uint8Array], { type: mime });
    
        // Convert Blob to File
        return new File([blob], fileName, { type: mime });
    }
    
    
  

    return (
        <AnimationWrapper>

            <section className="w-screen min-h-screen grid items-center py-16 lg:grid-cols-2">

                    <button 
                        className="size-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                        onClick={handleCloseEvent}>

                              <i className="fi fi-br-cross"></i>

                    </button>

                    {/* This is the banner image and description section */}
                    <div className="w-full">

                          <p className="text-dark-grey mb-5 text-xl">Preview</p>
                          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey">

                              <img 
                                src={ banner } 
                              />

                          </div>
                          <h1 className="text-3xl font-medium mt-2 leading-tight line-clamp-1">{title}</h1>

                          <p className="font-gelasio line-clamp-2 text-dark-grey mb-2 mt-4">{description}</p>

                    </div>

                    {/* This is the form section */}
                    <div className="border-grey lg:border-1 lg:pl-8">

                            <p className="text-dark-grey mb-2 mt-3">Blog Title</p>
                            <input 
                            type="text" 
                            placeholder="Blog Title" 
                            defaultValue={title} 
                            className="input-box pl-4" 
                            onChange={handleBlogTitleChange}
                            onKeyDown={handleKeyDown}
                            />

                            <p className="text-dark-grey mb-2 mt-9">Short Description about your blog</p>
                            <textarea 
                            maxLength={characterLimit} 
                            defaultValue={description} 
                            className="h-40 resize-none leading-7 input-box pl-4" 
                            onChange={handleBlogDesChange} 
                            onKeyDown={handleKeyDown}
                            />

                            <p className="mt-1 text-dark-grey text-sm text-right">
                                {characterLimit - description.length} characters left
                            </p>

                            <p className="text-dark-grey mb-2 mt-9">Topics - (Helps in searching and ranking your blog post)</p>

                            <div className="relative input-box pl-2 py-2 pb-4">

                                <input 
                                    type="text" 
                                    placeholder="Topic" 
                                    className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                                    onKeyDown={handleTagKeyDown}
                                />
                                {
                                  tags.map((tag, i) => {
                                    return <Tag tag={tag} key={i} tagIndex={i} />
                                  })
                                }
                                
                            </div>

                            <p className="mt-1 mb-4 text-dark-grey text-right">
                                {tagLimit - tags.length} Tags left
                            </p>

                            <button onClick={handlePublishClick} className="btn-dark px-8">Publish</button>
   
                    </div>

            </section>

        </AnimationWrapper>
    );
};

export default PublishForm;
