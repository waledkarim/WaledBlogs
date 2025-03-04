import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../App";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/AnimationWrapper";
import AboutUser from "../components/about.component";
import BlogPostCard from "../components/BlogPost.component";
import InPageNavigation from "../components/InPageNavigation.component";
import NoDataMessage from "../components/NoData.component";
import PageNotFound from "./404Page.page";

// Profile Data Structure
export const profileDataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        bio: "",
    },
    account_info: {
        total_posts: 0,
        total_blogs: 0,
    },
    social_links: {},
    joinedAt: "",
};

const ProfilePage = () => {

    const { id: profileId } = useParams();
    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState(null);
    const [profileLoaded, setProfileLoaded] = useState('');

    let { personal_info: { fullname, username: profile_username, profile_img, bio }, 
      account_info: { total_posts, total_reads }, 
      social_links, joinedAt } = profile;

    let { userAuth: { username } } = useContext(UserContext);

    useEffect(() => {
        if (profileId !== profileLoaded) {
            setBlogs(null);
        }
    
        if (blogs === null) {
            resetStates();
            fetchUserProfile();
        }
    }, [profileId, blogs]);
    


   
    const fetchUserProfile = () => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
                username: profileId,
            })
            .then(({ data: user }) => {

                console.log("Clicked user: ", user);
                if(user !== null){
                    setProfile(user);
                }
                setProfileLoaded(profileId);
                getBlogs({user_id: user._id});
                setLoading(false);
            })
            .catch((err) => {

                setLoading(false);
                return toast.error("An error occured: ", err.message);

            });
    };

    const getBlogs = ({ user_id }) => {

        user_id = user_id === undefined ? blogs.user_id : user_id;
    
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            author: user_id,
        })
        .then(async ({ data }) => {

            console.log("Blogs of this user: ", data);
            setBlogs(data.blogs);

        })
        .catch((err) => {
            return toast.error("An error occured: ", err.message);
        })
    };
    

    const resetStates = () => {

        setProfile(profileDataStructure);
        setLoading(true);
    }


    return (
        <AnimationWrapper>

            {loading ? (
                <Loader />
            ) : (
                profile_username.length ?
                <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">

                    <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">


                        {/* Profile Image */}
                        <img src={profile_img} className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32" />

                        {/* Username & Name */}
                        <h1 className="text-2xl font-medium">@{profile_username}</h1>
                        <p className="text-xl capitalize h-6">{fullname}</p>

                        {/* User Stats */}
                        <p>
                            {total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads
                        </p>

                        {/* Edit Profile Button (only for logged-in user) */}
                        <div className="flex gap-4 mt-2">
                            {profileId === profile_username ? (
                                <Link to="/settings/edit-profile" className="btn-light rounded-md">
                                    Edit Profile
                                </Link>
                            ) : (
                                ""
                            )}
                        </div>

                        <AboutUser className={`max-md:hidden`} bio={bio} social_links={social_links} joinedAt={joinedAt} />


                    </div>

                    <div className="max-md:mt-12 w-full">

                        <InPageNavigation routes={["Blogs Published", "About"]} defaultHidden={['About']} >
                                {/*  */}
                                <>
                                    {
                                        blogs === null ? <Loader /> :
                                            blogs.length ?
                                            (
                                                blogs.map((blog, i) => {
                                                
                                                return(
                                                    <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                                        <BlogPostCard content={blog} author={blog.author.personal_info} />
                                                    </AnimationWrapper>
                                                )

                                                })
                                            ) :
                                            (
                                                <NoDataMessage message={"No blogs published"} />
                                            )
                                    }
                                </>

                                {/*  */}
                                <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
            
                        </InPageNavigation>

                    </div>


                </section>
                : 
                <PageNotFound />
            )}

        </AnimationWrapper>
    );
};

export default ProfilePage;
