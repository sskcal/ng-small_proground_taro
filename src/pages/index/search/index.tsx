import React,{useState} from 'react'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import {useDispatch} from 'react-redux'
import {search} from '@actions/recommend'
const Search = () => {
  const [keyWord, setKeyWord] = useState('')
  // const recommendState = useSelector(state => state.recommend)
  const dispatch = useDispatch()
  const submitSearch = ()=>{
    dispatch(search(keyWord))
  }
  return (
      <View className="home-search">
        <AtSearchBar
          actionName='搜索'
          value={keyWord}
          onChange={(val:string)=>setKeyWord(val)}
          onActionClick={submitSearch}
        />
      </View>
  )
}
export default Search