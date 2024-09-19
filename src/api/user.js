
/**
  用户请求模块
 */
import request from "@/utils/request";
// import store from "@/store"

export const login = data =>{
    return request({
        method:'POST',
        url:'/v1_0/authorizations',
        data
    })
}

// 发送短信验证码
export const sendMsm = mobile =>{
    return request({
        method:"GET",
        url:`/v1_0/sms/codes/${mobile}`,
    })
}

// 获取用户自己信息
export const getUserInfo = () => {
    return request({
        nethod:"GET",
        url:'/v1_0/user',
        // // 发送请求数据
        // headers:{
        //     // 注意Bearer后面有个空格
        //  Authorization:`Bearer ${store.state.user.token}`,
        //     }

    })
}

// 获取用户频道列表
export const getUserChannels = ()=>{
    return request({
        method:"GET",
        url:'/v1_0/user/channels'
    })
}


// 关注用户
export const addFollow = (target) => {
    return request({
        method:"POST",
        url:`/v1_0/user/followings`,
        data:{
            target
        }
    })
}

// 取消关注
export const deleteFollow = (target) => {
    return request({
        method:"DELETE",
        url:`/v1_0/user/followings/${target}`
    })
}

// 获取当前用户 个人资料
export const getUserProfile = () => {
    return request({
        method: "GET",
        url: "/v1_0/user/profile"
    })
}

// 编辑用户个人资料
export const  updateUserProfile = data => {
    return request({
        method: "PATCH",
        url: "/v1_0/user/profile",
        data
    })
}

// 更改用户头像
export const updateUserPhoto = data => {
    return request({
        method:"PATCH",
        url:"/v1_0/user/photo",
        data
    })
}
