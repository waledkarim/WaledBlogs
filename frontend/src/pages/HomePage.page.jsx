import { useEffect, useState } from "react";
import AnimationWrapper from "../common/AnimationWrapper";
import InPageNavigation from "../components/InPageNavigation.component";
import axios from 'axios';
import Loader from '../components/loader.component';
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import NoDataMessage from '../components/nodata.component';
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";


const HomePage = () => {

  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState , setPageState] = useState("home");

  console.log(blogs);

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

      fetchLatestBlogs();

  }, [pageState]);


  const fetchLatestBlogs = () => {

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
        .then( async ({ data }) => {

          console.log(data.blogs);
          setBlogs(data.blogs);
        
        })
        .catch(err => {

            console.log("Error fetching latest blogs: ",err);

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

                    <InPageNavigation routes={[pageState, "trending blogs"]} >
                        {
                          blogs?.map((blog, i) => {
                            return (
                              <AnimationWrapper 
                                      key={i}
                                      transition={{ duration: 1, delay: i * 0.1 }} 
                                    >
                                            <BlogPostCard content={blog} author={blog.author.personal_info} />

                                    </AnimationWrapper>
                            )
                          })
                        }
                        {/* {
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
                        } */}
                        
                    </InPageNavigation>

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
                                  {trendingBlogs === null ? <Loader /> :
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
