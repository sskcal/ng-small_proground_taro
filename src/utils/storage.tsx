import Taro from '@tarojs/taro'


export const getStorage = async (key):Promise<any> => {
    return new Promise((resolve,reject)=>{
        Taro.getStorage({
            key,
          }).then(res=>{
            resolve(res.data)
          }).catch(error=>{
            resolve({})
          })
    })
}



