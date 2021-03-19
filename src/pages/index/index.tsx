import React,{useState,useEffect} from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Search from './search'
import Banner from './banner'
import Recommend from './recommend'
import { getWindowHeight } from '@utils/style'
import { useSelector, useDispatch } from 'react-redux'
import { getIndexList } from '@actions/recommend'

import './index.scss'



const Home = () => {
  const [loading, setLoading] = useState(false)
  const [showNotMore, setShowNotMore] = useState(false)
  const recommendState = useSelector(state => state.recommend)
  const dispatch = useDispatch()
  // 滚动条触底后执行此方法
  const loadRecommend = () => {
    setLoading(true)
    // 滚动触底后给为你推荐翻页
    const { current, totalPage } = recommendState
    if (current >= totalPage) {
      setLoading(false)
      setShowNotMore(true)
      return
    }
    dispatch(getIndexList({ current: current + 1,setLoading }))
  }



  return (
    <View>
      
      <Search />
      <ScrollView
        scrollY
        className='home__wrap'
        onScrollToLower={loadRecommend}
        style={{ height: getWindowHeight() }}
      >
        {/* 轮播图 */}
        <Banner />
        {/* 为你推荐 */}
        <Recommend />
        {loading &&
            <View className='home__loading'>
              <Text className='home__loading-txt'>正在加载中...</Text>
            </View>
          }
        {showNotMore && <View className='home__loading home__loading--not-more'>
          <Text className='home__loading-txt'>更多内容，敬请期待</Text>
        </View>}
      </ScrollView>
    </View>
  )
}
export default Home