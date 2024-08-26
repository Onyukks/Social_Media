import {createContext,useReducer} from 'react'

export const FriendRequestContext = createContext()

export const FriendRequestReducer = (state,action)=>{
    switch (action.type){
        case "SET_REQUEST":
            return {
                requests:action.payload
            }
        case "UPDATE_REQUEST":
            return {
                requests:state.requests.filter(request=>request._id!==action.payload)
            }
        default:
            return state
    }
}

export const FriendRequestContextProvider = ({children})=>{
    const [state,dispatch] = useReducer(FriendRequestReducer,{
      requests:null
    })
 
     return (
         <FriendRequestContext.Provider value={{...state,dispatch}}>
             {children}
         </FriendRequestContext.Provider>
     )
 }