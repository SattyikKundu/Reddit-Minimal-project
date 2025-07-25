import { useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';

import {getAllSubReddits} from './menuSlice.js';
import RedditAPIcalls from "../../utils/redditAPIcalls/redditAPIcalls";

import { SubRedditsErrorNotice, SubRedditsLoadingNotice } from "./menuNotices.js";

import './subredditsMenu.css';

const SubRedditsMenu = ({setSubRedditUrl, setSubPermalink, isMenuOpened}) => {

    // Track currently selected Sub Reddit (default subReddit value is useState())

    //const [selected, setSelected] = useState('/r/Damnthatsinteresting/');
    const [selected, setSelected] = useState('/r/Home/'); 

    const subReddits = useSelector(state => state.menu.subReddits);// import states from menuSlice
    const status     = useSelector(state => state.menu.status);
    const error      = useSelector(state => state.menu.error);

    const dispatch = useDispatch(); // for dispatching menuSlice.js functions

    useEffect(()=>{ 

        setSubPermalink(selected); // send selected subReddit to App

        const asyncFetch = async () => {
            setSubRedditUrl(RedditAPIcalls.getFullSubRedditUrl(selected)); // Stores url of default Subreddit 
            dispatch(getAllSubReddits()); // runs getSubReddits() and stores subReddit values into state 
        };
        asyncFetch();
    },[]); 

    const handleClick = (subRedditUrl) => {
        setSelected(subRedditUrl);

        setSubPermalink(subRedditUrl); // sends selected/current permalink (i.e '/r/Home') back to App

        /* Used 'subRedditUrl' instead of 'selected' since getFullSubRedditUrl() is 
           asynchronous and 'selected' may not be updated by time of click */
        setSubRedditUrl(RedditAPIcalls.getFullSubRedditUrl(subRedditUrl)); 
    }


    return (  // Return subreddits' params value in menu
        <div className={`subreddits-menu ${!isMenuOpened ? 'closed': ''}`}>
            <div id='subreddits-header'>Subreddits</div>
            <div className="subreddits-container">
                {status === 'loading' && <SubRedditsLoadingNotice/>}
                {status === 'failed' && <SubRedditsErrorNotice error={error}/>}
                {(status === 'succeeded' && subReddits && subReddits.length>0)
                    ?subReddits.map((subReddit, idx) => {
                        return (
                            <div 
                                key = {subReddit.title || idx}
                                className={selected!==subReddit.url? "subreddit-item": "subreddit-item-clicked"}
                                onClick={() => handleClick(subReddit.url)}
                            >
                                <img src={subReddit.iconUrl || 'images/no-image-icon.png'} 
                                    alt={subReddit.title} 
                                    className="icon-img"
                                    style={{border: `3px solid ${subReddit.color}`}} 
                                />
                                <div className="subReddit-title">{subReddit.title}</div>
                            </div>
                        );
                    })
                    :null
                }
            </div>
        </div>
    );
};

export default SubRedditsMenu;