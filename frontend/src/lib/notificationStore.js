import axios from 'axios'
import {create} from  'zustand'

export const useNotificationStore = create(set=>({
    number:0,
    fetch:async()=>{
        const {data} = await axios.get('/api/chat/notifications')
        set({number:data})
    },
    decrease:()=>{
        set(prev=>({number:prev.number-1}))

    },
    reset:()=>{
        set({number:0})
    }
}))