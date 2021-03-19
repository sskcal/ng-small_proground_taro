import { GET_LEFT_LIST,SET_RIGHT_LIST } from '@constants/cate'


const initailState = {
    leftMenuList: [],
    rightMenuList: [],
    current: '0',
}


export default function cate(state = initailState, action) {
    const { type, payload } = action
    switch (type) {
        case GET_LEFT_LIST:
            return {
                ...state,
                leftMenuList:payload.list,
                current:payload.current,
                rightMenuList:payload.list.find(x=>x._id === payload.current).children
            }
        case SET_RIGHT_LIST:
            return {
                ...state,
                rightMenuList:payload.list,
                current:payload.current
            }
        default:
            return state
    }
}