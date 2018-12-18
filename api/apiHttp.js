(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.apiHttp = factory());
}(this, (function () {
    axios.defaults.timeout =  10000;
   // axios.defaults.baseURL = 'http://219.132.139.116:9080'; // 21'9.132.139.116:909'0 219.132.139.116:9080 '39.108.245.13'0:9080
		//axios.defaults.baseURL = 'http://219.132.139.116:9080';
	axios.defaults.baseURL = 'http://219.132.139.116:9080';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.transformRequest = [function (data) {
        let newData = '';
        for (let k in data) {
        newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
        }
        return newData;
    }];
    var apiHttp = {
        fetchPost: function (url, params, config) {
            return new Promise((resolve, reject) => {
                axios.post(url, params, config)
                  .then((response) => {
                    resolve(response.data);
                  }, (error) => {
                    reject(error);
                  })
                  .catch((error) => {
                    reject(error);
                  })
              })
        },
        fetchGet: function (url, params) {
            return new Promise((resolve, reject) => {
                axios.get(url, {
                    params: params
                  })
                  .then((response) => {
                    resolve(response.data);
                  }, (error) => {
                    reject(error);
                  })
                  .catch((error) => {
                    reject(error);
                  })
              })
        },
        fetchManyAcyncPost: function (requireStrArr, paramsArr) {
            return new Promise((resolve, reject) => {
                let isAllStr = requireStrArr.every(item => typeof item === 'string');
            
                if (!isAllStr) {
                  throw new Error('requireStrArr param in fetchManyPost must be string type in axiosConfig.js.');
                }
            
                let requireFns = requireStrArr.map((requireStr, i) => axios.post(requireStr, paramsArr[i]));
            
                axios.all(requireFns)
                  .then(axios.spread((...retArr) => resolve(retArr)))
                  .catch((error) => reject(error));
              })
        },
    }
    return apiHttp
})))