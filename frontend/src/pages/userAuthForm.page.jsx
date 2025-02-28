import { useContext, useRef, useState } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import axios from 'axios';
import toast from "react-hot-toast";
import { storeInSession } from '../common/session';
import { UserContext } from "../App";

const UserAuthForm = ({ type }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    //todo
    const authFormRef = useRef();


    const { userAuth: { access_token }, setUserAuth } = useContext(UserContext)



    function useAuthThroughServer(serverRoute, formData){

         axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
                    .then(({ data }) => {
                        storeInSession("user", JSON.stringify(data));
                        setUserAuth(data);
                    })
                    .catch(({ response }) => {
                        toast.error(response.data.error);
                    })

    }

    function handleSubmit( e ){

        const serverRoute = (type === "sign-in" ? "/signin" : "/signup");

        e.preventDefault();

        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,3}$/; // regex for email
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        const formData = Object.fromEntries(new FormData(authFormRef.current));

        const { fullname, email, password } = formData;

        //Validations
      {  
            if(fullname){
                if (fullname.length < 3) {
                    return toast.error("Fullname must be at least 3 letters long");
                }
            }
            if (!email.length) {
                return toast.error("Enter Email");
            }
            if (!emailRegex.test(email)) {
                return toast.error("Email is invalid" );
            }
            if (!passwordRegex.test(password)) {
                return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter");
            }
      }

        useAuthThroughServer(serverRoute, formData);
        
    }
    
    
    return (
        <AnimationWrapper key={type}>
            <section className="h-cover flex items-center justify-center">
                {
                    access_token ? 
                    <Navigate to={'/'} /> :
                    (
                        <form ref={authFormRef} className="w-[80%] max-w-[400px]">
                        <h1 className="text-4xl font-gelasio capitalize text-center mb-4">
                            {type === "sign-in" ? "Welcome back" : "Join us today"}
                        </h1>
                        {type !== "sign-in" && (
                            <InputBox
                                name="fullname"
                                type="text"
                                placeholder="Full Name"
                                icon="fi fi-rr-user"
                            />
                        )}
                        <InputBox
                            name="email"
                            type="email"
                            placeholder="Email"
                            icon="fi fi-rr-envelope"
                        />
                        <InputBox
                            name="password"
                            type={"password"}
                            placeholder="Password"
                            icon="fi fi-rr-key"
                            passwordVisible={passwordVisible}
                            setPasswordVisible={setPasswordVisible}
                        />
                        <button onClick={handleSubmit} type="submit" className="btn-dark center mt-5 md:text-base">
                            {type.replace("-", " ")}
                        </button>
                        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                            <hr className="w-1/2 border-black" />
                            <p>or</p>
                            <hr className="w-1/2 border-black" />
                        </div>
                        <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center md:text-base">
                            <img src={googleIcon} className="w-5" />
                            Continue with Google
                        </button>
                        {type === "sign-in" ? (
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Don't have an account? 
                                <Link to="/signup" className="underline text-black text-xl ml-1">
                                    Join us today
                                </Link>
                            </p>
                        ) : (
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Already a member? 
                                <Link to="/signin" className="underline text-black text-xl ml-1">
                                    Sign in here.
                                </Link>
                            </p>
                        )}
                        </form>
                    )
                    
                } 
            </section>
        </AnimationWrapper>
    );
};

export default UserAuthForm;
