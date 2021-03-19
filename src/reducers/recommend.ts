import { GET_INDEX_LIST,SET_KEY_WORD } from '@constants/recommend'


const initailState = {
    list: [],
    current: 0,
    totalPage: 0,
    keyWord:'',
}


export default function recommend(state = initailState, action) {
    const { type, payload } = action
    switch (type) {
        case GET_INDEX_LIST:
            const list = state.list
            return {
                ...state,
                list:payload.current > 1?[...list,...payload.list]:payload.list,
                current:payload.current,
                totalPage:Math.ceil(payload.count / PAGE_SIZE)
            }
        case SET_KEY_WORD:
            return {
                ...state,
                keyWord:payload
            }
        default:
            return state
    }
}