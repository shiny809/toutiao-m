/* 评论请求模块 */

import request from "@/utils/request"

export const getComments = params =>{
    return request({
        method:"GET",
        url:"/v1_0/comments",
        params
    })

}

// 对评论点赞
export const addCommentLike = target => {
    return request({
        method: "POST",
        url: "/v1_0/comment/likings",
        data:{
            target
        }
    })

}

// 取消对评论点赞
export const removeCommentLike = target => {
    return request({
        method: "DELETE",
        url: `/v1_0/comment/likings/${target}`,
    })

}

// 发布文章评论或评论进行评论
export const addComment = data => {
    return request({
        method:"POST",
        url:"/v1_0/comments",
        data
    })

}

// 获取评论或评论回复，和上面文章评论是同一个接口 ，知识传输数据类型不同
// export const getReplyComments = params=> {
//     return request({
//         method: "GET",
//         url: "/v1_0/comments",
//         params
//     })

// }