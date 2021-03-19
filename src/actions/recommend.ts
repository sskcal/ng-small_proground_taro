import { GET_INDEX_LIST,SET_KEY_WORD } from '@constants/recommend'
import api from '@utils/api'
interface IGetIndexList{
    (params:{current:number,keyWord?:string,setLoading?:any}):void
}
/**
 * 获取首页为你推荐数据
 * current 当前页
 * setLoading   开关loading状态的方法
 */
export const getIndexList:IGetIndexList = ({ current = 1, keyWord, setLoading }) =>{
    return (dispatch,getState) => {
        const {keyWord:keyWordState} = getState().recommend
        const title = keyWord?keyWord:keyWordState
        const submitData = { current, title, pageSize: PAGE_SIZE }
       
        
        api.post(`/index/list`, submitData).then(res => {
            const { status, data } = res
            // data 的结构= {list,count}
            const payload = { ...data , current }
            status && dispatch({ type: GET_INDEX_LIST, payload })
            setLoading && setLoading(false)
        })
    }
}
// 搜索
export function search(keyWord){
    return (dispatch)=>{
        // 先在状态设置关键词
        dispatch({type:SET_KEY_WORD,payload:keyWord})
        // 执行上面获取数据方法（里面有关键词就可以查询想查的数据了)
        dispatch(getIndexList({current:1,keyWord}))
    }
}