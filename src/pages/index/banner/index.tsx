import React, { useState, useEffect } from 'react'
import { View, Image } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { Swiper, SwiperItem } from '@tarojs/components'
import { get as getGlobalData } from '../../../global_data'
import api from '../../../utils/api'
import './index.scss'
const findImg = getGlobalData('findImg')
const Banner = () => {
    const [pics, setPics] = useState([])
    useEffect(() => {
        api.post('/banner/list', { name: "小程序首页轮播图760x374" }).then(res => {
            const { data, status } = res
            if (status) {
                setPics(data.map(item => item.pictures).map(item => {
                    return findImg(item)
                }))
            }
        })
    }, [])

    return (
        <View className="home-banner">
            <Swiper
                className='banner-swiper'
                indicatorColor='#999'
                indicatorActiveColor='#333'
                circular
                indicatorDots
                autoplay>
                    {pics.map((item:any)=>{
                        return <SwiperItem>
                        <Image
                        src={item.picUrl}
                        />
                </SwiperItem>
                    })}

            </Swiper>
        </View>
    )
}
export default Banner