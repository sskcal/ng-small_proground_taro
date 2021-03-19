import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import Taro,{ useRouter } from '@tarojs/taro'
import Tab from './tab'
import ItemList from './item-list'
import { getWindowHeight } from '@utils/style'
import { getList } from '@actions/list'

import './index.scss'

const height = getWindowHeight()
export default () => {
    const [showNotMore, setShowNotMore] = useState(false)
    const dispatch = useDispatch()
    const [selectTabIndex, setSelectTabIndex] = useState(0)
    const router = useRouter()
    const { cateId } = router.params
    const [newCateId, setNewCateId] = useState(cateId)
    const [cateState, listData] = useSelector(state => [state.cate, state.list.listData])
    const { rightMenuList } = cateState


    const fatherMenuList = rightMenuList.find(x => x.children.find(y => y._id === cateId)).children || []

    const handleChange = (e) => {
        
        
        const { current: swiperIndex } = e.detail
        // 设置选中的tab
        setSelectTabIndex(swiperIndex)
        const { _id,name } = fatherMenuList[swiperIndex]
        // 更新选中的分类id
        setNewCateId(_id)
        Taro.setNavigationBarTitle({title:name})
        // 切换tab的时候隐藏底部没有数据的提示
        showNotMore && setShowNotMore(false)
    }


    useEffect(() => {
        // 从状态里查找list数据，看已经翻到第几页
        const { current,totalPage,count } = listData?.find(x => x.cateId === newCateId) || {current:0,totalPage:0}
        if (current >= totalPage && totalPage > 0) {
            setShowNotMore(true)
            return
        }
        const { name } = fatherMenuList.find(x=>x._id === newCateId)
        name && Taro.setNavigationBarTitle({title:name})
        
        dispatch(getList({ current:current+1, cateId: newCateId }))
        // 切换tab的时候隐藏底部没有数据的提示,因为newCateId变动，代表tab应该页被切换了
        showNotMore && setShowNotMore(false)
    }, [newCateId])

    const scrollToLower = (item) => {
        // 主要想获取当前在第几页,总页数
        const { current, totalPage } = listData.find(x => x.cateId === item._id)
        
        if (current >= totalPage) {
            setShowNotMore(true)
            return
        }
        dispatch(getList({ current: current+1, cateId: newCateId }))
    }

    return (
        <View className='cate-sub'>
            <View className='cate-sub__menu'>
                <Tab
                    list={fatherMenuList}
                    cateId={newCateId as string}
                    setSelectTabIndex={setSelectTabIndex}
                />
            </View>
            {/* 用 Swiper 实现左右滑动效果 */}
            <Swiper
                className='cate-sub__swiper'
                current={selectTabIndex}
                onChange={(e) => handleChange(e)}
                style={{ height }}
            >

                {fatherMenuList.map((item) => {

                    const itemData = listData.find(x => x.cateId === item._id) || {}

                    return <SwiperItem className='cate-sub__swiper-item'>

                        <ScrollView
                            scrollY
                            className='cate-sub__list'
                            style={{ height }}
                            onScrollToLower={() => {
                                scrollToLower(item)
                            }}
                        >
                            {
                                itemData?.list?.length ? <ItemList list={itemData?.list || []} /> : (<View className='cate-sub__list-tip'>
                                    <Text className='cate-sub__list-tip-txt'>暂无数据,横向滑动切换其他分类</Text>
                                </View>)
                            }
                            {showNotMore && <View className='cate-sub__list-tip panding150px'>
                                <Text className='cate-sub__list-tip-txt'>更多内容，敬请期待</Text>
                            </View>}
                        </ScrollView>

                    </SwiperItem>
                })}

            </Swiper>
        </View>
    )
}
