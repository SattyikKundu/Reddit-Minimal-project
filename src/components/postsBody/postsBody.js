import React from "react";
import {useEffect } from "react";
import { useSelector, useDispatch  } from "react-redux";
import ReactMarkdown from 'react-markdown'; // used to handle and render markdown text 
                                            // to look like normal text in React app

import { getPosts } from "./postsSlice.js"; // asyncThunk function that retrieves posts based on subreddit url 
                                            // through the 'posts' slice.
//import {VideoHolder, ImageHolder} from "./mediaHolder/mediaHolder.js"; // Custom component functions used to handle any images & video 

import VideoHolder from "./mediaHolder/videoHolder.js";
import ImageHolder from "./mediaHolder/imageHolder.js";
import LinkHolder from "./mediaHolder/linkHolder.js";

import './postsBody.css';


const PostsBody = ({ subRedditUrl }) => {

    const posts  = useSelector(state => state.posts.posts);
    const status = useSelector(state => state.posts.status);
    const error  = useSelector(state => state.posts.error);

    const dispatch = useDispatch();

    useEffect(() => {
        const subFetch = async () => { // an async function without await is just a normal function...
            if (subRedditUrl) {
                dispatch(getPosts(subRedditUrl));
            }   
        }
        subFetch();
    },[subRedditUrl]);


    if(status  === 'loading') {
        return(
          <div className="all-posts">
            <h2>loading....</h2>
          </div>
        )
    }

    if(status  === 'failed') {
        return(
          <div className="all-posts">
            <h2>Error is: {error}</h2>
          </div>
        )
    }

    if(status === 'succeeded' && posts && posts.length>0) {
        return (
            <div className="all-posts">
            {posts.map((post)=>{
                return (
                    <div className="post-wrapper">
                        <div className="post" key={post.permalink}>
                            <div className="post-info">
                                <div className="user-name">
                                </div>
                                <div className="created-time">
                                </div>
                            </div>
                            <h2 className="title">{post.title}</h2>
                                {/* Check if post uses image gallery, and then render it */}
                                {
                                (post.postType==='gallery' && post.images && post.images.length>0) 
                                ?(  // use <ImageHolder> to handle image gallery
                                    <ImageHolder postType={"gallery"} images={post.images} />
                                ):(
                                    post.galleryUnavailable ? 
                                    ( 
                                        // Otherwise, check for rare issue where gallery existed but can't be retrieved
                                        <div className="gallery-unavailable">Gallery unavailable.</div>
                                    ) 
                                    : null 
                                  )
                                }
                                {/* Check if post uses single image as media, and then render */}
                                {
                                    (post.postType==='image' && post.images && post.images.length>0) &&
                                    <ImageHolder postType={"image"} images={post.images} />
                                }
                                {/* Check if post uses reddit-host video, and then render */}
                                {
                                    (post.postType==="hosted:video" && post.video && post.video.length>0) &&
                                    <VideoHolder postType={"hosted:video"} video={post.video} />
                                }
                                {/* Check if post uses external embedded video (i.e. YouTube), and then render */}
                                {
                                    (post.postType==="rich:video" && post.video && post.video.length>0) &&
                                    <VideoHolder postType={"rich:video"} video={post.video} />
                                }
                                {/* Check if post uses embedded link to external site, and then render */}
                                {
                                    (post.postType==="link" && post.video && post.video.length>0) &&
                                    <LinkHolder linkPreview={post.linkPreview} />
                                }
                            <div className="body-text"
                                style={{
                                display: (post.text===''|| post.text===null) && 'none' // remove text block if empty
                                }}
                            ><ReactMarkdown>{post.text}</ReactMarkdown> 
                            </div >
                            <div className="up-votes">{post.ups}</div>
                        </div> 
                    </div>
                )
            })}
            </div>
        )
    }
};

export default PostsBody;



// Old version below:
/*
const PostsBody = ({ subRedditUrl }) => {

    const posts  = useSelector(state => state.posts.posts);
    const status = useSelector(state => state.posts.status);
    const error  = useSelector(state => state.posts.error);

    const dispatch = useDispatch();

    useEffect(() => {
        const subFetch = async () => { // an async function without await is just a normal function...
            if (subRedditUrl) {
                dispatch(getPosts(subRedditUrl));
            }   
        }
        subFetch();
    },[subRedditUrl]);


    return (
        <div className="all-posts">
            {status  === 'loading' && <h2>loading....</h2>}
            {status  === 'failed' && <h2>Error is: {error}</h2>}
            {(status === 'succeeded' && posts && posts.length>0) 
                ?(posts.map((post)=>{
                    return (
                        <div className="post-wrapper">
                            <div className="post" key={post.permalink}>
                                <div className="post-info">
                                    <div className="user-name">

                                    </div>
                                    <div className="created-time">

                                    </div>
                                </div>
                                <h2 className="title">{post.title}</h2>
                                { (post.video || (post.images && post.images.length>0)) ? ( // checks if post video or image(s) exist...
                                    // If video exists, prioritize rendering it, otherwise render image(s) instead
                                    (post.video)?  (
                                        <VideoHolder video={post.video} />
                                    ) : (
                                        <ImageHolder images={post.images} />
                                    )
                                ): post.galleryUnavailable ? ( 
                                    // If image rendering fails, check if gallery originally existed for post, but is now inaccessible. 
                                    <div className="gallery-unavailable">Gallery unavailable.</div>
                                ) : null 
                                }
                                {
                                // (post.video || (post.images && post.images.length>0)) && // checks if post video or image(s) exist...
                                    // If video exists, prioritize rendering it, otherwise render image(s) instead
                                 //   (post.video)?  (<VideoHolder video={post.video} />) : (<ImageHolder images={post.images} />)
                                
                                }
                                <div className="body-text"
                                    style={{
                                    display: (post.text===''|| post.text===null) && 'none' // remove text block if empty
                                    }}
                                ><ReactMarkdown>{post.text}</ReactMarkdown> 
                                </div >
                                <div className="up-votes">{post.ups}</div>
                            </div> 
                        </div>
                    )
                }))
                : (null)
            }
        </div>
    );
};

*/