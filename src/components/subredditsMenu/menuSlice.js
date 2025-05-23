import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RedditAPIcallsfrom from "../../utils/redditAPIcalls/redditAPIcalls";

/* AsyncThunk() for extracting data for creating subReddit choices for menu  */
export const getAllSubReddits = createAsyncThunk('menu/getAllSubReddits', // links to extraReducers in 'menu' slice

    //async ()=>{ // asycn function that run on extraReducer trigger
    async (_, { rejectWithValue }) => { // <== review this later!!!!

        try {
            const data = await RedditAPIcallsfrom.getSubReddits(); // get All subreddits from json (unable to add await?)
            const subRedditsArray = data.data.children.map((child)=>( // returns array of menu item objects
                { 
                    iconUrl: child.data.icon_img,
                    color:   child.data.primary_color,
                    title:   child.data.display_name,
                    url:     child.data.url || ''
                    //url:     RedditAPIcallsfrom.getFullSubRedditUrl(child.data.url || '')
                }
            ));
            console.log('Sub Reddits array: ', subRedditsArray);
            return subRedditsArray; // return array with sub Reddits' information for menu
        }
        catch (error) {
            return rejectWithValue('Reddit API failed');
        }
    }
)

const menuSlice = createSlice({
    name: "menu",
    initialState: {
        subReddits: [],
        status: 'idle',
        error: ''
    },
    reducers: {},
    extraReducers: (builder) => { // triggers when getSubReddits() executes
        builder
        .addCase(getAllSubReddits.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getAllSubReddits.rejected, (state, action) => {
            state.status = 'failed';
            state.error  = action.error.message;
        })
        .addCase(getAllSubReddits.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.subReddits = action.payload;
        })
    }
});

export default menuSlice.reducer; // exports slice

