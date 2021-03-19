import { RECORD_CART_DATA,MODIFY_CART_QUANTITY,CLEAR_CART_DATA } from "@constants/cart";




type pricesType = {
    priceId: string,
    bTime: Date,
    cost: number
    discount: number
    distribution: number
    eTime: Date
    name: string
    retail: number
    stock: number
    buyQuantity: number //购买数量
    validDay: Number
}

type BuyDetaileType = {
    productId: string,
    title: string,
    indexImg: { PicUrl: string, width: number, height: number }[],
    prices: pricesType[],
    //订单号,提交订单后从服务端获取后存进来(下面都是)
    orderNo: Number
    //这里存被提交过的productId
    products: string[]
    // 调起支付所需对象
}
type RequestPaymentObjType = {
    paySign?: string
    timeStamp?: number
    nonceStr?: string
    package?: string,
    signType?: 'RSA',
}
type ContactType = {
    realName:string,
    phone:string,
}
const initialState: { buyList: BuyDetaileType[],requestPaymentObj: RequestPaymentObjType,contact:ContactType } = {
    buyList: [],
    requestPaymentObj:{},
    contact:{
        realName:'',
        phone:'',
    },
}

export default (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case RECORD_CART_DATA:
            return {
                ...state,
                buyList: payload,
            }
        case  MODIFY_CART_QUANTITY:
            return {
                ...state,
                // 删除要修改数量的数据,插入新数据
                buyList: payload
            }
        case CLEAR_CART_DATA:
            return initialState
        default:
            return state
    }
}