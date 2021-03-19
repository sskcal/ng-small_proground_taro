import {GET_LIST} from '@constants/list'
import api from '@utils/api'

/**
 * 查询某一分类下的数据列表
 * @param current 当前页数
 * @param cateId 分类_id
 */
export const getList = ({current,cateId}) =>{
    return async (dispatch,getState)=>{
        const {listData} = getState()?.list
        api.post('/list/index',{current,pageSize:PAGE_SIZE,categories:[cateId]}).then(res=>{
            // data 的结构= {list,count}
            const {status,data} = res
            const oldList = listData?.find(x=>x.cateId === cateId)?.list || []
            // 如果原来的状态中有数据 ？ 数据累加 : 保存新数据
            const payload = oldList.length 
            ? 
            {...data,current,cateId,list:[...oldList,...data.list]} 
            :
            {...data,current,cateId}
            status && dispatch({type:GET_LIST,payload})
            
        })
    }
}