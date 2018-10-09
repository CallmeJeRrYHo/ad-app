(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.apiConfig = factory());
}(this, (function () {
    'use strict';
     var apiConfig = {
        
        // 公告类
        selectMsg: '/msg/selectMsg', 
        addMsg: '/msg/addMsg', 
        readMsg: '/msg/readMsg', 

        // 广告类
        auditLiveView: '/advertisement/auditLiveView',
        addAdvertisement: '/advertisement/addAdvertisement',
        selectMyAd: '/advertisement/selectMyAd', 
        sendWarning: '/advertisement/sendWarning',
        getAdDetail: '/advertisement/getAdDetail',
        selectAdList: '/advertisement/selectAdList', // t
        submitLiveViewAudit: '/advertisement/submitLiveViewAudit',
        designAudit: '/advertisement/designAudit',
        updateDesign: '/advertisement/updateDesign',
        deleteAd: '/advertisement/deleteAd',
        

        // 报警类
        auditWarningHandle: '/warning/auditWarningHandle',
        handleWarning: '/warning/handleWarning',
        getWarningDetail: '/warning/getWarningDetail',
        selectMyWarning: '/warning/selectMyWarning',
        
        // 用户类
        uploadPic: '/pic/uploadPic',
        selectUsers: '/user/selectUsers',
        selectCompany: '/user/selectCompany',
        deleteUser: '/user/deleteUser',
        addUser: '/user/addUser',
        updateUser: '/user/updateUser',
        deleteCompany: '/user/deleteCompany',
        updateCompany: '/user/updateCompany',
        addCompany: '/user/addCompany',
        adMonitor: '/user/adMonitor',
        changePassword: '/user/changePassword',
        updateUserInfo: '/user/updateUserInfo',
        getUserInfo: '/user/getUserInfo',
        login: '/user/login', // t
        addUserToCompany: '/user/addUserToCompany',
        removeUserCompany: '/user/removeUserCompany',
        selectUserCompany: '/user/selectUserCompany',
        adMonitor: '/user/adMonitor',
        selectMyCompany: '/user/selectMyCompany',

        // 统计类
        adStatistics: '/statistics/adStatistics',
        


        

        
     }
     return apiConfig
})))