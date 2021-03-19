import { GET_LEFT_LIST, SET_RIGHT_LIST } from '@constants/cate'
import api from '@utils/api'


export const getCateList = (pathLength: number = 1) => {
    return async (dispatch) => {
        api.post(`/cate/list`, { pathLength }).then(res => {
            const { status, data } = res
            status && dispatch({ type: GET_LEFT_LIST, payload: { list: data, current: data[0]._id } })
        })

    }
}

export const setRightList = (current) => {
    return async (dispatch, getState) => {
        const { leftMenuList } = getState().cate
        dispatch({type:SET_RIGHT_LIST,payload:{
            list:leftMenuList.find(item => item._id === current).children,
            current
        }})
    }
}