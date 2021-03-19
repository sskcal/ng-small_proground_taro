import { View,Image } from '@tarojs/components'
import React, { useEffect,useState } from 'react'
import Taro, {  getSetting, getUserInfo } from '@tarojs/taro'
import api from '@utils/api'
import { AtButton, AtFloatLayout } from "taro-ui"
import {modifyUserInfo} from '@actions/user'
import {useDispatch} from 'react-redux'
import logoPng from '@assets/logo.png'
import { MODIFY_USER_INFO } from '@constants/user'
import './index.scss'


export default () => {
    
    // const router = useRouter()
    const dispatch = useDispatch()
    const [isOpened, setIsOpened] = useState(false)

    const needLogin = ()=>{
        Taro.login({
            success(res) {
                if (res.code) {
                    //发起网络请求
                    api.get('/wxsmall/code2session?jsCode=' + res.code).then(res => {
                        // 通过code换session_key成功后，返回登陆成功状态token
                        if (res.status) {
                            Taro.setStorage({ key: 'userInfo', data: res.data })
                            needGetSetting()
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }

    const needGetSetting = ()=>{
        getSetting({
            success: (res) => {
                if (res.authSetting) {
                    // 确认当对当前用户是否拥有getUserInfo的授权
                    if (!res.authSetting['scope.userInfo']) {
                        // 让用户授权获取用户信息getUserInfo
                        setIsOpened(true)
                    }else{
                        // 获取用户昵称头像，用于显示
                        getUserInfo({success:function(res){
                            const {userInfo} = res
                            dispatch({type:MODIFY_USER_INFO,payload:userInfo})
                        }})
                    }

                }
            }
        })
    }

    useEffect(() => {
       
        Taro.checkSession({
            success() {
                //session_key 未过期，并且在本生命周期一直有效
                Taro.getStorage({
                    key:"userInfo",
                    success:(res)=>{
                        if(res.data.token){
                            needGetSetting()
                        }else{
                            needLogin()
                        }
                    }
                }).catch(error=>{
                    needLogin()
                })
            },
            fail() {
                //   session_key 已经失效，需要重新执行登录流程
                needLogin()
            }
        })
        
    },[])
    return (
        <View>
            <AtFloatLayout isOpened={isOpened}>
                <View className="login-logo">
                    <Image src={logoPng}/>
                </View>
                
                <AtButton type="primary" openType="getUserInfo" onGetUserInfo={(e)=>{
                   if(e.detail.errMsg.indexOf("fail")>-1){
                    Taro.showToast({
                        title:"拒绝，没法登陆哦！～"
                    })
                   }else{
                       console.log('laile?')
                       const { userInfo } = e.detail
                        // 保存进数据库
                       dispatch(modifyUserInfo(userInfo,setIsOpened))
                   }
                }}>微信授权登陆</AtButton>
            </AtFloatLayout>
        </View>
    )
}
