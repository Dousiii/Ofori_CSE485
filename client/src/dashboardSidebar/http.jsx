import axios from 'axios';

const client = axios.create({
    baseURL: 'http://127.0.0.1:5000', // 这里设置你的API基础链接
    headers: {
        'Content-Type': 'application/json'
    }
});

// GET 请求
const get = (url, params) => client.get(url, { params });

// POST 请求
const post = (url, data) => client.post(url, data);

// PUT 请求
const put = (url, data) => client.put(url, data);

// DELETE 请求
const del = (url) => client.delete(url);

// 封装所有方法到一个对象中方便导出使用
const http = {
    get,
    post,
    put,
    delete: del
};

export default http;
