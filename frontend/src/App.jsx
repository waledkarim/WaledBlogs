import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { Toaster } from 'react-hot-toast';
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/EditorPage.page";
import HomePage from "./pages/HomePage.page";
import SearchPage from "./pages/SearchPage.page";
import PageNotFound from "./pages/404Page.page";
import ProfilePage from "./pages/ProfilePage.page";
import BlogPage from "./pages/BlogPage.page";

export const UserContext = createContext({});

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {

        console.log("Inside useEffect of App.jsx");

        const userInSession = lookInSession('user');

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token: null});
        
    }, []);
    
    console.log(userAuth);

    return (
        <UserContext.Provider value={{userAuth, setUserAuth}}>
            <Routes>

                <Route path="/editor" element={<Editor />} />
                <Route path="/editor/:blog_id" element={<Editor />} />
                <Route path="/" element={<Navbar />}>
                    <Route index element={<HomePage />} />
                    <Route path="signin" element={<UserAuthForm type={`sign-in`}/>} />
                    <Route path="signup" element={<UserAuthForm type={`sign-up`}/>} />
                    <Route path="search/:query" element={<SearchPage/>} />
                    <Route path="user/:id" element={<ProfilePage/>} />
                    <Route path="blog/:blog_id" element={<BlogPage />} />
                    <Route path="*" element={<PageNotFound/>} />
                </Route>
                
            </Routes>
            <Toaster />
        </UserContext.Provider>
    );
};

export default App;
