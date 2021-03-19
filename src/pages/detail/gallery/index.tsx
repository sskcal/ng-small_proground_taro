import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import {get as getGlobalData} from '../../../global_data'
const findImgList = getGlobalData("findImgList")
import './index.scss'

export default () => {
    const allImgList = useSelector(state => findImgList(state.detail.mainImg) || [])
    // 在不同尺寸中找出最合适尺寸的几张图片
    const list = allImgList?.filter(x=>x.width === allImgList[0].width) || []
    
    
    
    const [current, setCurrent] = useState(0)

        return (
            <View className='item-gallery'>
                <Swiper
                    className='item-gallery__swiper'
                    current={current}
                    onChange={(e)=>setCurrent(e.detail?.current)}
                >
                    {list?.map((item) => (
                        <SwiperItem
                            key={item.uid}
                            className='item-gallery__swiper-item'
                        >
                            <Image
                                className='item-gallery__swiper-item-img'
                                src={item.picUrl || ''}
                            />
                        </SwiperItem>
                    ))}
                </Swiper>
                <View className='item-gallery__indicator'>
                    <Text className='item-gallery__indicator-txt'>
                        {`${current + 1}/${list.length}`}
                    </Text>
                </View>
            </View>
        )
    
}
