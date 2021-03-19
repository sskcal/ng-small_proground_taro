import React, { useEffect } from 'react'
import { View, Image, Text } from '@tarojs/components'
import Auth from '@components/auth'
import defaultAvatar from './assets/defaultAvatar.png'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import daizhifuPng from './assets/daizhifu.png'
import yizhifuPng from './assets/yizhifu.png'
import tuikuanPng from './assets/tuikuan.png'
import quanbudingdanPng from './assets/quanbudingdan.png'
import daipingjiaPng from './assets/daipingjia.png'
import fensiPng from './assets/fensi.png'
import fensidingdanPng from './assets/fensidingdan.png'
import fenxiangPng from './assets/fenxiang.png'
import shouchangPng from './assets/shouchang.png'
import pinglunPng from './assets/pinglun.png'
import xinxiPng from './assets/xinxi.png'


import './index.scss'
const payment = [
    { name: '待支付', pngUrl: daizhifuPng ,link:'/pages/user/orders/index?type=0'},
    { name: "已支付", pngUrl: yizhifuPng ,link:'/pages/user/orders/index?type=1'},
    { name: "退款", pngUrl: tuikuanPng ,link:'/pages/user/orders/index?type=2'},
    { name: "待评价", pngUrl: daipingjiaPng ,link:'/pages/user/orders/index?type=3'},
    { name: "全部", pngUrl: quanbudingdanPng ,link:'/pages/user/orders/index?type=4'},
]
const bodyList = [
    { name: '我的粉丝', pngUrl: fensiPng ,link:''},
    { name: '粉丝订单', pngUrl: fensidingdanPng ,link:''},
    { name: '快速张粉', pngUrl: fenxiangPng ,link:''},
    { name: '我收藏的', pngUrl: shouchangPng ,link:''},
    { name: '我的评论', pngUrl: pinglunPng ,link:''},
    { name: '常用信息', pngUrl: xinxiPng ,link:''},
]
const User = () => {
    const userState = useSelector(state => state.user)

    const { nickName, avatarUrl } = userState
    
    useEffect(() => {
        Taro.setNavigationBarTitle({
            title:"我的"
        })
    }, [])

    const goTo = (link)=>{
        Taro.navigateTo({
            url:link
        })
    }
    return (
        <View className="body">
            <Auth />
            <View className="user-avatar">
                <View className="avatar-bg"></View>
                <View className="avatar-url">
                    <Image src={avatarUrl || defaultAvatar} />
                    <Text>{nickName || '用户昵称'}</Text>
                </View>
            </View>
            <View className="payment-status">

                {
                    payment.map(x => {
                        return <View onClick={()=>{goTo(x.link)}}>
                            <Image src={x.pngUrl} />
                            <Text>{x.name}</Text>
                        </View>
                    })
                }
            </View>
            <View className="body-list">
                {
                    bodyList.map(item=>{
                        return (<View onClick={()=>{Taro.showToast({title:'系统升级后实现,敬请期待!',icon:'none'})}}>
                            <Image src={item.pngUrl} />
                            <Text>{item.name}</Text>
                        </View>)
                    })
                }
            </View>
        </View>
    )
}
export default User