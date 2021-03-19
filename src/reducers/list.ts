import { GET_LIST } from '@constants/list'

type ListType = {
    cateId:string,
    index:number,
    list:any[],
    current:number,
    totalPage?:number,
    count:number
}

type InitailType = {
    listData:ListType[],
}
const initailState:InitailType = {
    listData:[]
}


export default function cate(state = initailState, action:{type:string,payload:ListType}) {
    let { type, payload } = action
    switch (type) {
        case GET_LIST:
            const totalPage = Math.ceil(payload.count/PAGE_SIZE)
            payload = {...payload,totalPage}
            
            // const listData = state.listData.find(x=>x.cateId === payload.cateId && x.count === payload.count) ? state.listData : [...state.listData,payload]
            const listData = [...state.listData.filter(x=>x.cateId!==payload.cateId),payload]
            return {
                ...state,
                listData
            }
        default:
            return state
    }
}