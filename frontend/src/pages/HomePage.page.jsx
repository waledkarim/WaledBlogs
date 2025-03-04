import { useEffect, useState } from "react";
import AnimationWrapper from "../common/AnimationWrapper";
import InPageNavigation from "../components/InPageNavigation.component";
import axios from 'axios';
import Loader from '../components/loader.component';
import BlogPostCard from "../components/BlogPost.component";
import MinimalBlogPost from "../components/NoBannerBlogPost.component";
import NoDataMessage from '../components/NoData.component';
import { filterPaginationData } from "../common/filter-pagination-data";
import Pagination from "../components/Pagination.component";


const HomePage = () => {

  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState , setPageState] = useState("home");
  const [currentPage, setCurrentPage] = useState(1);

  const blogsPerPage = 5;
  const lastBlogIndex = currentPage * blogsPerPage;
  const firstBlogIndex = lastBlogIndex - blogsPerPage;
  const totalBlogs = blogs?.length;
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  console.log("totalPages: ", totalPages);
  console.log("currentPage: ", currentPage);
  console.log("pageState: ", pageState);

  //todo
  const categories = [
    "Programming",
    "Film Making",
    "Hollywood",
    "Social Media", 
    "Cooking", 
    "Tech", 
    "Finances", 
    "Travel"
  ];

  useEffect(() => {

      if(pageState === 'home'){
        console.log("inside fetchLatestBlogs");
        fetchLatestBlogs();
      }

      if(pageState !== 'home'){
        console.log("inside fetchBlogsByCategory");
        fetchBlogsByCategory();
      }

      fetchLatestTrendingBlogs();
      

  }, [pageState]);


  const fetchLatestBlogs = () => {

    axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
        .then( async ({ data }) => {

          setBlogs(data.blogs);
          console.log("Latest blogs: ",data.blogs);
        
        })
        .catch(err => {

            console.log("Error fetching latest blogs: ",err);

        });
  };

  const fetchLatestTrendingBlogs = () => {
    axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
        .then(({ data }) => {
          console.log("trending blogs: ", data.blogs);
          setTrendingBlogs(data.blogs);
        })
        .catch(err => {
            console.log(err);
        });
  };

  const fetchBlogsByCategory = () => {
    
    axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState })
        .then(async ({ data }) => {

          setBlogs(data.blogs);
            
        })
        .catch((err) => {

            console.log(err);

        });

  };

  function handleCategoryClick( e ){

    const category = e.target.innerText.toLowerCase();
    setBlogs(null);

    //Deselection purpose
    if(pageState === category){
      setPageState("home"); 
      return;
    }

    setPageState(category);

  }

    return (
      <AnimationWrapper>

          <section className="h-cover flex justify-center gap-10">

              {/* Latest blogs and trending blogs */}
              <div className="w-full">

                  <InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={['trending blogs']} >

                      {/* latest blogs */}
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
                      </>

                      {/* trending blogs */}
                      <>
                      {
                            trendingBlogs == null ? <Loader /> :
                            (
                              trendingBlogs.length ? 
                                (
                                  trendingBlogs.map((blog, i) => {
                                    return (
                                        <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                            <MinimalBlogPost blog={blog} index={i} />
                                        </AnimationWrapper>
                                    );
                                })
                                ) :
                                (
                                  <NoDataMessage message={"No trending blogs"} />
                                )
                            )
                        }
                      </>
                              
                  </InPageNavigation>
                   
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)}/>

              </div>

              {/* Filters and trending blogs section (RHS) shown in large screens*/}
              <div>

                  <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">

                        <div className="flex flex-col gap-10">

                            {/* Categories Section */}
                            <div>
                                <h1 className="font-medium text-xl mb-8">Stories from all interests</h1>
                                <div className="flex gap-3 flex-wrap">
                                    {
                                      categories.map((category, i) => {
                                        return (
                                            <button 
                                              onClick={handleCategoryClick} 
                                              className={`tag ${pageState === category.toLowerCase() && "bg-black text-white"}`} 
                                              key={i}
                                            >
                                                {
                                                  category
                                                }
                                            </button>
                                        );
                                    })
                                    }
                                </div>
                            </div>

                            {/* Trending Blogs Section */}
                            <div>
                                <h1 className="font-medium text-xl mb-8">
                                    Trending <i className="fi fi-rr-arrow-trend-up"></i>
                                </h1>
                                {
                                  trendingBlogs === null ? <Loader /> :
                                    (
                                      trendingBlogs.length ? 
                                        (
                                          trendingBlogs.map((blog, i) => {
                                            return (
                                                <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                                    <MinimalBlogPost blog={blog} index={i} />
                                                </AnimationWrapper>
                                            );
                                        })
                                        ) :
                                        (
                                          <NoDataMessage message={"No trending blogs"} />
                                        )
                                    )
                                }
                            </div>


                        </div>

                  </div>

              </div>

          </section>
          
      </AnimationWrapper>
    );
};

export default HomePage;
