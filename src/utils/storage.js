/* 
封装本地存储的方法
*/
// 1.存储数据
export const setItem = (key,value)=>{
    if (typeof value === 'object'){
        value = JSON.stringify(value)
    }
    localStorage.setItem(key,value)
}

// 2.获取数据
export const  getItem = key =>{
  const value = localStorage.getItem(key)
    try{
        return JSON.parse(value)
    }catch(err){
        return value
    }
}

// 3.删除数据
export const removeItem = key =>{
    localStorage.removeItem(key)
}