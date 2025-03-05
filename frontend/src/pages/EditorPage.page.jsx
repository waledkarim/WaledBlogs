import { createContext, useState, useContext, useEffect } from "react";
import PublishForm from "../components/PublishForm.component";
import BlogEditor from '../components/BlogEditor.component';
import { UserContext } from '../App';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import axios from "axios";

const blogStructure = {

  title: "",
  banner: "",
  content: [],
  tags: [],
  description: "",
  author: { personal_info: {} }, //todo

};

export const EditorContext = createContext({});

const Editor = () => {

  const { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor"); //editor or publish
  const [textEditor, setTextEditor] = useState({isReady: false});
  const [loading, setLoading] = useState(true);
  
  const { userAuth: { access_token } } = useContext(UserContext);

  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }
  
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {
      blog_id, draft: true, mode: "edit"
    })
    .then(({ data: { blog } }) => {
      setBlog(blog);
      setLoading(false);
    })
    .catch(err => {
      setBlog(null);
      setLoading(false);
    });
  
  }, []);
  


  return (
    <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor,}}>

      {
        access_token === null ? <Navigate to="/signin" /> :
        loading ? <Loader /> :
        (editorState === "editor" ? <BlogEditor /> : <PublishForm />)
      }

    </EditorContext.Provider>
  );
};

export default Editor;
