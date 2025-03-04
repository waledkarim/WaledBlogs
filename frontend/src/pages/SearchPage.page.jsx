import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InPageNavigation from "../components/InPageNavigation.component";
import Loader from "../components/loader.component";
import Pagination from "../components/Pagination.component";
import axios from 'axios';
import AnimationWrapper from "../common/AnimationWrapper";
import BlogPostCard from "../components/BlogPost.component";
import NoDataMessage from "../components/NoData.component";
import { toast } from 'react-hot-toast';
import UserCard from "../components/UserCard.component";

const UserCardWrapper = ({ users }) => {
    return (
        <>
            {users === null ? (
                <Loader />
            ) : users.length ? (
                users.map((user, i) => {
                    return (
                        <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                            <UserCard user={user} />
                        </AnimationWrapper>
                    );
                })
            ) : (
                <NoDataMessage message="No user found" />
            )}
        </>
    );
};

const SearchPage = () => {

    let { query } = useParams();

    let [blogs, setBlogs] = useState(null);
    let [users, setUsers] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const blogsPerPage = 5;
    const lastBlogIndex = currentPage * blogsPerPage;
    const firstBlogIndex = lastBlogIndex - blogsPerPage;
    const totalPages = Math.ceil(blogs?.length / blogsPerPage);

    console.log("totalPages: ", totalPages);
    console.log("currentPage: ", currentPage);

    useEffect(() => {

        searchBlogs();
        fetchUsers();

    }, [query]);

    const searchBlogs = () => {

        console.log(query);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs', { query } )
             .then(({ data }) => {
                console.log("Searched blogs: ", data.blogs);
                setBlogs(data.blogs);
             })
             .catch((err) => {
                return toast.error(`An error occured: ${err.message}`);
             })

    }

    const fetchUsers = () => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
            .then(({ data }) => {

                console.log("Searched users: ", data.users);
                setUsers(data.users);

            })
            .catch((err) => {
                return toast.error("An error occured: ", err.message);
            })
    };
    


    return (
        <section className="h-cover flex justify-center gap-10">

            <div className="w-full">

                <InPageNavigation
                    routes={[`Search Results from "${query}"`, "Accounts Matched"]}
                    defaultHidden={["Accounts Matched"]}
                >

                    {/* Blogs Section */}
                    <>
                        {
                            blogs === null ? <Loader /> :
                            blogs.length ?
                            (
                                blogs.slice(firstBlogIndex, lastBlogIndex).map((blog, i) => {
                                return(
                                    <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                        <BlogPostCard content={blog} author={blog.author.personal_info} />
                                    </AnimationWrapper>
                                )
                                })
                                
                            ) :
                            (
                                <NoDataMessage message={"No blogs available"} />
                            )
                        }
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)}/>
                    </>

                    {/* Users Section */}
                    <UserCardWrapper  />

                </InPageNavigation>
            </div>

            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">

                <h1 className="font-medium text-xl mb-8">
                    User related to search <i className="fi fi-rr-user mt-1"></i>
                </h1>
                
                <UserCardWrapper users={users}/>

            </div>

            
        </section>
    );
};


export default SearchPage;
