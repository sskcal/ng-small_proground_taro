import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { Provider } from 'react-redux'
import {set as setGlobalData} from './global_data'
import configStore from './store'
import CartCount from './pages/cart/count'
import 'taro-ui/dist/style/index.scss'
import './app.scss'


const store = configStore()

class App extends Component {
  componentDidMount () {
    Taro.getSystemInfo({
      success:res=>{
        const {screenWidth} = res
        let contentImgWidth = 320
        if(screenWidth > 320){
          contentImgWidth = 420
        }
        if(screenWidth > 420)
        {
          contentImgWidth = 760
        }
        // 在图片列表中，根据屏幕宽，找出最合适宽度的图片
        const findImg = (imgList)=>imgList.map(x=>{
          const c = Math.abs(x.width - screenWidth)
          return {...x,c}
      }).sort((a,b)=>a.c - b.c)[0]
      const findImgList = (imgList)=>imgList.map(x=>{
        const c = Math.abs(x.width - screenWidth)
        return {...x,c}
    }).sort((a,b)=>a.c - b.c)
        setGlobalData('findImg',findImg)
        setGlobalData('findImgList',findImgList)
        setGlobalData('contentImgWidth',contentImgWidth)
      }
    })
  }
  

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <CartCount/>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
