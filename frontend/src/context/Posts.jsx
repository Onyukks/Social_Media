import { createContext, useReducer } from "react";

export const PostContext = createContext()

export const PostReducer = (state,action)=>{
    switch (action.type){
        case "SET_POSTS":
            return {
                posts:action.payload
            }
        case "ADD_POSTS":
            return {
                posts:[action.payload,...state.posts]
            }
        case "DELETE_POSTS":
            return {
                posts:state.posts.filter(post=>post._id!==action.payload)
            }
        case "UPDATE_POST":
            return{
                posts:[action.payload,...state.posts.filter(post=>post._id!==action.payload._id)]
            }
        default:
            return state
    }
}

export const PostContextProvider = ({children})=>{
   const [state,dispatch] = useReducer(PostReducer,{
     posts:null
   })

    return (
        <PostContext.Provider value={{...state,dispatch}}>
            {children}
        </PostContext.Provider>
    )
}