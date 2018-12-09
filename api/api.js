(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.api = factory());
}(this, (function() {
	var api = {
		HOST: 'http://39.108.245.130:9090',
		// 公告类
		selectMsg: function(data) {
			return apiHttp.fetchPost(apiConfig.selectMsg, data);
		},
		addMsg: function(data) {
			return apiHttp.fetchPost(apiConfig.addMsg, data);
		},
		readMsg: function(data) {
			return apiHttp.fetchPost(apiConfig.readMsg, data);
		},

		// 广告类
		auditLiveView: function(data) {
			return apiHttp.fetchPost(apiConfig.auditLiveView, data);
		},
		addAdvertisement: function(data) {
			return apiHttp.fetchPost(apiConfig.addAdvertisement, data);
		},
		updateAdvertisement: function(data) {
			return apiHttp.fetchPost(apiConfig.updateAdvertisement, data);
		},
		selectMyAd: function(data) {
			return apiHttp.fetchPost(apiConfig.selectMyAd, data);
		},
		sendWarning: function(data) {
			return apiHttp.fetchPost(apiConfig.sendWarning, data);
		},
		getAdDetail: function(data) {
			return apiHttp.fetchPost(apiConfig.getAdDetail, data);
		},
		selectAdList: function(data) {
			return apiHttp.fetchPost(apiConfig.selectAdList, data);
		},
		submitLiveViewAudit: function(data) {
			return apiHttp.fetchPost(apiConfig.submitLiveViewAudit, data);
		},
		designAudit: function(data) {
			return apiHttp.fetchPost(apiConfig.designAudit, data);
		},
		updateDesign: function(data) {
			return apiHttp.fetchPost(apiConfig.updateDesign, data);
		},
		deleteAd: function(data) {
			return apiHttp.fetchPost(apiConfig.deleteAd, data);
		},

		// 报警类
		auditWarningHandle: function(data) {
			return apiHttp.fetchPost(apiConfig.auditWarningHandle, data);
		},
		handleWarning: function(data) {
			return apiHttp.fetchPost(apiConfig.handleWarning, data);
		},
		getWarningDetail: function(data) {
			return apiHttp.fetchPost(apiConfig.getWarningDetail, data);
		},
		selectMyWarning: function(data) {
			return apiHttp.fetchPost(apiConfig.selectMyWarning, data);
		},

		// 用户类
		uploadPic: function(data) {
			return apiHttp.fetchPost(apiConfig.uploadPic, data);
		},
		selectUsers: function(data) {
			return apiHttp.fetchPost(apiConfig.selectUsers, data);
		},
		selectCompany: function(data) {
			return apiHttp.fetchPost(apiConfig.selectCompany, data);
		},
		deleteUser: function(data) {
			return apiHttp.fetchPost(apiConfig.deleteUser, data);
		},
		addUser: function(data) {
			return apiHttp.fetchPost(apiConfig.addUser, data);
		},
		updateUser: function(data) {
			return apiHttp.fetchPost(apiConfig.updateUser, data);
		},
		deleteCompany: function(data) {
			return apiHttp.fetchPost(apiConfig.deleteCompany, data);
		},
		updateCompany: function(data) {
			return apiHttp.fetchPost(apiConfig.updateCompany, data);
		},
		addCompany: function(data) {
			return apiHttp.fetchPost(apiConfig.addCompany, data);
		},
		adMonitor: function(data) {
			return apiHttp.fetchPost(apiConfig.adMonitor, data);
		},
		changePassword: function(data) {
			return apiHttp.fetchPost(apiConfig.changePassword, data);
		},
		updateUserInfo: function(data) {
			return apiHttp.fetchPost(apiConfig.updateUserInfo, data);
		},
		getUserInfo: function(data) {
			return apiHttp.fetchPost(apiConfig.getUserInfo, data);
		},
		login: function(data) {
			return apiHttp.fetchPost(apiConfig.login, data);
		},
		addUserToCompany: function(data) {
			return apiHttp.fetchPost(apiConfig.addUserToCompany, data);
		},
		removeUserCompany: function(data) {
			return apiHttp.fetchPost(apiConfig.removeUserCompany, data);
		},
		selectUserCompany: function(data) {
			return apiHttp.fetchPost(apiConfig.selectUserCompany, data);
		},
		selectMyCompany: function(data) {
			return apiHttp.fetchPost(apiConfig.selectMyCompany, data);
		},
		adMonitor: function(data) {
			return apiHttp.fetchPost(apiConfig.adMonitor, data);
		},

		// 统计类
		adStatistics: function(data) {
			return apiHttp.fetchPost(apiConfig.adStatistics, data);
		},
		newStatistics: function(data) {
			return apiHttp.fetchPost(apiConfig.newStatistics, data);
		},
		listPatrolRecord: function(data) {
			return apiHttp.fetchPost(apiConfig.listPatrolRecord, data);
		},
		patrolRecordDetail: function(data) {
			return apiHttp.fetchPost(apiConfig.patrolRecordDetail, data);
		},
		patrolRecordDetailAdd: function(data) {
			return apiHttp.fetchPost(apiConfig.patrolRecordDetailAdd, data);
		},
	}
	return api
})))
