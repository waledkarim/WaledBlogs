import { useState, useRef } from "react";

export let activeTabRef;

const InPageNavigation = ({ children, routes}) => {

     activeTabRef = useRef();

    let [routeIndex, setRouteIndex] = useState(0); //0, 1[pageState, "trending blogs"]

    const changePageState = ( i ) => {
        setRouteIndex(i);
    };

    return (
        <>

            {/* Inpage header */}
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">

                {
                    routes.map((route, i) => {
                            return (
                                
                                <button
                                    ref={i === routeIndex ? activeTabRef : null}
                                    key={i}
                                    className={`p-4 px-5 capitalize ${routeIndex === i ? "text-black" : "text-dark-grey"} ${route === "trending blogs" && "md:hidden"} ${routeIndex === i && "border-b-4 border-dark-grey"}`}
                                    onClick={() => changePageState(i)}
                                >

                                            {
                                                route
                                            }

                                </button>

                            );
                        })
                }

            </div>

            {
                children && children[routeIndex]
            }

        </>
    );
};

export default InPageNavigation;
