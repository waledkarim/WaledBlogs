import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog-banner.png";
import { EditorContext } from "../pages/editor.pages";
import logo from "../imgs/logo.png";
import { tools } from "./tools.component";
import EditorJS from '@editorjs/editorjs'


const BlogEditor = () => {

  const { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);


  useEffect(() => {

      setTextEditor(new EditorJS({
        holderId: "textEditor",
        data: content,
        tools,
        placeholder: "Let's write an awesome story"
      }));
      
  }, []);
  

  const handleBannerUpload = (e) => {

    const img = e.target.files[0];

    if (img) {

      const reader = new FileReader();
      reader.readAsDataURL(img); 
      let loadingToast;

      //This function gets triggered when file uploading.
      reader.onprogress = function () {
        console.log("uploading");
        loadingToast = toast.loading("Uploading...");
      }

      //This function gets invoked when file upload complete.
      reader.onload = function () {

        console.log(reader.result);
        toast.dismiss(loadingToast);
        toast.success("Uploaded Successfully ✅");
        setBlog({...blog, banner:  reader.result});

      };

      //This function will be fired when there has been an error.
      reader.onerror = function () {

          toast.dismiss(loadingToast);
          toast.error("Error reading file ❌");

      };
  }


  };

  function handleTitleKeyDown(e){
    const { key } = e;
    if(key === 'Enter'){
      e.preventDefault();
    }
  }

  function handleTitleChange(e){
    console.log(e);
    const { value } = e.target;


    //todo
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';


    setBlog({...blog, title: value});
  }

  function handleImgError(e){
    e.target.src = defaultBanner;
  }

  function handlePublish(){

    if(!banner.length){
        return toast.error("You have to add a banner before publishing a blog");
    }

    if(!title.length){
        return toast.error("You have to add a title before publishing a blog");
    }

    if(textEditor.isReady){
      console.log("Inside");
      textEditor
            .save()
            .then(data => {
                    console.log(data);
                    if(data.blocks.length){
                        setBlog({ ...blog, content: data });
                        setEditorState("publish");
                    } else {
                        return toast.error("Write something in your blog to publish it");
                    }
              })
            .catch((err) => {
                    toast.error("Something went wrong in the editor", err);
              });
    }
  

  }

  return (
    <>
      <nav className="navbar">

                <Link to="/" className="flex-none w-10">

                    <img src={logo} alt="Logo" />

                </Link>

                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {
                      title ? title : "New Blog"
                    }
                </p>

                <div className="flex gap-4 ml-auto">

                    <button onClick={handlePublish} className="btn-dark py-2">Publish</button>
                    <button className="btn-light py-2">Save Draft</button>
                    
                </div>
      </nav>

      <AnimationWrapper>

        <section className="">

            <div className="mx-auto max-w-[900px] w-full">

                <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">

                    <label htmlFor="uploadBanner">

                        <img 
                          src={ banner } 
                          className="z-20" 
                          alt="Blog Banner" 
                          onError={handleImgError}
                          />
                        <input
                          id="uploadBanner"
                          type="file"
                          accept=".png, .jpg, .jpeg"
                          hidden
                          onChange={handleBannerUpload}
                        />

                    </label>

                </div>

                <textarea
                  defaultValue={title}
                  placeholder="Blog Title"
                  className="text-4xl font-medium w-full outline-none resize-none mt-5 leading-tight placeholder:opacity-40"
                  onKeyDown={handleTitleKeyDown}
                  onChange={handleTitleChange}
                />

                <hr className="w-full opacity-10 mt-5" />

                <div id="textEditor" className="font-gelasio"></div>

            </div>

        </section>

      </AnimationWrapper>

    </>
  );
};

export default BlogEditor;
