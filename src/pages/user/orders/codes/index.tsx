import React, { useEffect,useState } from 'react'
import { View, Canvas,Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { featchCodes } from '@actions/user'
import { useDispatch, useSelector } from 'react-redux'
import drawQrcode from 'weapp-qrcode';
import './index.scss'

export default () => {
  
    const codesState = useSelector(state => state.user.codes)
    const [codeIndex, setCodeIndex] = useState(0)

    const dispatch = useDispatch()
    const router = useRouter()
    const { orderId } = router.params

    useEffect(() => {
       
        Taro.setNavigationBarTitle({
            title: "电子码"
        })
        dispatch(featchCodes(orderId))
        if(!codesState.length) return
        drawQrcode({
            width: 200,
            height: 200,
            canvasId: 'myQrcode',
            text: codesState[codeIndex].code.toString()
        }); 
    }, [codesState.length,codeIndex])
    
    const getCodesInfo = () => {
        if(!codesState.length) return null
        const { productInfo ,quantity,useQuantity,refundQuantity} = codesState[codeIndex]
        const {title,speName,} = productInfo
        const surplusQuantity = quantity - useQuantity - refundQuantity
        // setSurplusQuantity(surplusQuantity)
        return (<View>
                <View className="title">当前订单</View>
                <View><Text>产品：</Text>{title}</View>
                <View><Text>规格：</Text>{speName}</View>
                <View><Text>购买数量：</Text>{quantity}</View>
                <View style={{color:'red'}}><Text>可用数量：</Text>{surplusQuantity}</View>
                {refundQuantity ? <View><Text>退款数量：</Text>{refundQuantity}</View>:null}
                <View><Text>电子码个数：</Text>{codesState.length}个/<Text>当前第：</Text>{codeIndex+1}个</View>
            
        </View>)
    }
    return (
        <View className="body">
            {
                getCodesInfo()
            }
            <View className="qr-code">
            <Canvas className='scanCode' canvasId='myQrcode' />
            <View className="code">{codesState[codeIndex]?.code}</View>
            </View>
            <View className="button">
                 {codeIndex === 0 ?null: <button onClick={()=>{setCodeIndex(x=>x-1)}}>上一个</button>}
                 {codeIndex === codesState.length -1 ? null:<button onClick={()=>{setCodeIndex(x=>x+1)}}>下一个</button>}
            </View>
        </View>

    )
}
