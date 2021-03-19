export default {
  pages: [
    "pages/index/index",
    "pages/user/index",
    "pages/user/orders/index",
    "pages/cart/index",
    "pages/cate/index",
    "pages/list/index",
    "pages/detail/index",
    "pages/buy/index",
    "pages/user/orders/detail/index",
    "pages/user/orders/codes/index",
    "pages/user/orders/refund/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  tabBar: {
    color: "#666",
    selectedColor: "#b4282d",
    backgroundColor: "#fafafa",
    borderStyle: "black",
    list: [{
      pagePath: "pages/index/index",
      iconPath: "./assets/tab-bar/home.png",
      selectedIconPath: "./assets/tab-bar/home-active.png",
      text: "首页"
    }, {
      pagePath: "pages/cate/index",
      iconPath: "./assets/tab-bar/cate.png",
      selectedIconPath: "./assets/tab-bar/cate-active.png",
      text: "分类"
    }, {
      pagePath: "pages/cart/index",
      iconPath: "./assets/tab-bar/cart.png",
      selectedIconPath: "./assets/tab-bar/cart-active.png",
      text: "购物车"
    }, {
      pagePath: "pages/user/index",
      iconPath: "./assets/tab-bar/user.png",
      selectedIconPath: "./assets/tab-bar/user-active.png",
      text: "我的"
    }]
  }
}
