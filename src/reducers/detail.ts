import { GET_DETAIL } from "@constants/detail";


const initialState = {
    title:'',
    mainImg:[],
    content:'',
    categories:[],
    cities:[],
    pagePrice:0,
    retailPrice:0,
}

export default (state=initialState,action)=>{
    const {type,payload} = action
    switch (type) {
        case GET_DETAIL:
            return {
                ...state,
                ...payload
            }
        default:
            return state
    }
}