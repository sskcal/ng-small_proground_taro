import { 
    RECORD_BUY_DATA, 
    MODIFY_BUY_QUANTITY, 
    MODIFY_BUY_LIST_STATUS,
    CLEAR_BUY_DATA
 } from "@constants/buy";



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
        case RECORD_BUY_DATA:
            return {
                ...state,
                buyList: payload,
                requestPaymentObj:{},//把调起支付的值清空
            }
        case MODIFY_BUY_QUANTITY:
            return {
                ...state,
                // 删除要修改数量的数据,插入新数据
                buyList: payload
            }
        case MODIFY_BUY_LIST_STATUS:
            return {
                ...state,
                // payload = {orderNo,products,prepayId,paySign}
                requestPaymentObj:payload.requestPaymentObj,
                contact:payload.contact,
                // payload = {orderNo,products,prepayId,paySign}
                // 1、先把没提交的订单排出来...state.buyList.filter(x => payload.products.find(y => y !== x.productId))
                // 2、在把提交的订单排出来，并加上{orderNo,products,prepayId,paySign}这些值
                // buyList: [...state.buyList.filter(x => payload.products.find(y => y !== x.productId)),...(state.buyList.filter(x => payload.products.find(y => y === x.productId)).map(x=>({...x,...payload})))]
            }
        case CLEAR_BUY_DATA:
            return initialState
        default:
            return state
    }
}