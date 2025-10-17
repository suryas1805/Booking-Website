import Axios from './axios'


Axios.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = token
    }
    return config;
})

Axios.interceptors.response.use(response => {
    return response;
}, error => {
    console.log('HTTP Error:', error.response)
    if (error.response) {
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }
    return Promise.reject(error.response.data)
})

class httpClient {
    async get(url, params) {
        const response = await Axios.get(url, {
            params,
        })
        return response;
    }

    async post(url, data) {
        const response = await Axios.post(url, data)
        return response;
    }

    async put(url, data, params) {
        const response = await Axios.put(url, data, { params })
        return response;
    }

    async delete(url, params) {
        const response = await Axios.delete(url, { params })
        return response;
    }

    async uploadPost(url, data, params) {
        const response = await Axios.post(url, data, {
            params,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response
    }

    async uploadPut(url, data, params = {}) {
        try {
            const response = await Axios.put(url, data, {
                params,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });
            return response;
        } catch (error) {
            console.error('Upload PUT error:', error.response?.data || error.message);
            throw error;
        }
    }

}

export default new httpClient()