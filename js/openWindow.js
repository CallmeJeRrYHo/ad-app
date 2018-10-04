(function (w) {
	// 空函数
	function shield() {
		return false;
	}
	document.addEventListener('touchstart', shield, false);//取消浏览器的所有事件，使得active的样式在手机上正常生效
	document.oncontextmenu = shield;//屏蔽选择函数
	// H5 plus事件处理
	var ws = null, as = 'pop-in';
	function plusReady() {
		ws = plus.webview.currentWebview();
		// Android处理返回键
		//	plus.key.addEventListener('backbutton',function(){
		//		back();
		//	},false);
		compatibleAdjust();
	}
	if (w.plus) {
		plusReady();
	} else {
		document.addEventListener('plusready', plusReady, false);
	}
	// DOMContentLoaded事件处理
	var domready = false;
	document.addEventListener('DOMContentLoaded', function () {
		domready = true;
		gInit();
		document.body.onselectstart = shield;
		compatibleAdjust();
	}, false);
	// 处理返回事件
	w.back = function (hide) {
		if (w.plus) {
			ws || (ws = plus.webview.currentWebview());
			if (hide || ws.preate) {
				ws.hide('auto');
			} else {
				ws.close('auto');
			}
		} else if (history.length > 1) {
			history.back();
		} else {
			w.close();
		}
	};
	var old_back = mui.back;
	mui.back = function() {
		if (w.plus) {
			var webviews = plus.webview.all();
			webviews.forEach(function(ele) {
				mui.fire(ele, 'refresh')
			})
		}
		old_back();
	}
	// w.systemBack = function() {
	// 	//首页返回键处理,处理逻辑：1秒内,连续两次按返回键，则退出应用
	// 	var first = null;
	// 	mui.back = function() {
	// 		if (!first) {//首次按键，提示‘再按一次退出应用’
	// 			first = (new Date()).getTime();
	// 			mui.toast('再按一次退出应用');
	// 			setTimeout(function() {
	// 				first = null;
	// 			}, 1000);
	// 		} else {
	// 			if ((new Date()).getTime() - first < 1000) {
	// 				plus.runtime.quit();
	// 			}
	// 		}
	// 	};
	// }
	// 处理点击事件
	var openw = null, waiting = null;
	/**
	 * 打开新窗口
	 * @param {URIString} id : 要打开页面url
	 * @param {boolean} wa : 是否显示等待框
	 * @param {boolean} ns : 是否不自动显示
	 * @param {JSON} ws : Webview窗口属性
	 * @param {JSON} extras : Webview页面传参
	 */
	w.clicked = function (id, wa, ns, ws, extras) {
		var arr = plus.webview.all();
		if (openw) {//避免多次打开同一个页面
			return null;
		}

		if (w.plus) {
			wa && (waiting = plus.nativeUI.showWaiting());
			ws = ws || {};
			ws.scrollIndicator || (ws.scrollIndicator = 'none');
			ws.scalable || (ws.scalable = false);
			ws.showedCB || (ws.showedCB = function () { });
			
			extras || (extras = {});
			console.log(JSON.stringify(extras))
			var pre = './';//'http://192.168.1.178:8080/h5/';
			// 正则id处理
			var pattern = /\w+(?=\.html)/g
			var formatID = id.match(pattern)[0] || id; 
			console.log('formatId', formatID);
			openw = plus.webview.create(pre + id, formatID, ws, extras);
			ns || openw.addEventListener('loaded', function () {//页面加载完成后才显示
				//		setTimeout(function(){//延后显示可避免低端机上动画时白屏
				openw.show(as, 500, ws.showedCB);
				closeWaiting();
				//		},200);
			}, false);
			openw.addEventListener('close', function () {//页面关闭后可再次打开
				openw = null;
			}, false);
			return openw;
		} else {
			w.open(id);
		}
		return null;
	};
	/**
	 * 打开页面并且关闭当前页面
	 * @param {Object} id
	 */
	w.clickedThenClose = function (id) {
		var ws = plus.webview.currentWebview();
		clicked(id, false, false, {
			showedCB: function () {
				console.log('showed');
				setTimeout(function () {
					ws.close("none");
				}, 100)

			}
		});

	}

	/**
	 * 关闭等待框
	 */
	w.closeWaiting = function () {
		waiting && waiting.close();
		waiting = null;
	}
	/**
	 * 封装跳转代码
	 * @param {Object} element 
	 * @param {Object} element.to 指向的页面 
	 * @param {Object} element.data 传递的数据
	*/
	w.jumpTo = function (element) {
    h5(function () {
      clicked(element.to, false, false, {}, element.data || {});
    })
	}
	/**
	 * h5准备封装
	 * @param {Function} func 
	 */
	w.h5 = function (func) {
		mui.plusReady(function() {
			func();
		})
	}


	/**
	 * 上传图片封装
	 */
	
	w.uploadImg = function(type, url, cb){
		if(!window.plus){
			mui.toast('请在手机上运行');
		}
		var buttons = ["相册","相机"];
		var type = type || 1; //1.不压缩; 2.压缩
		plus.nativeUI.confirm("上传图片",configCB,{"title":"选择",
				"buttons":buttons
			});
			
		function configCB(event) {
			var index=event.index; // 用户关闭确认对话框点击按钮的索引值
			console.log(index); 
			if("1" == index) {
				getImage(); //拍照上传
			}else {
				appendByGallery(); //相册选择
			}
		}
		
		
		function getImage(){
			var cmr = plus.camera.getCamera(); 
			console.log(cmr);
			cmr.captureImage( function ( p ) {
			plus.io.resolveLocalFileSystemURL( p, function ( entry ) {
				//转化本地绝对路径
				var urlHope = plus.io.convertLocalFileSystemURL(p);
				// if(type == 1){
				// 	appendFile(urlHope);
				// }else{
				// 	zipFile(urlHope);
				// }
				zipFile(urlHope);
			});  
			},function( error ) {
					console.log("---"+"Capture image failed: " + error.message);
				},{}   //建议使用系统匹配路径
			);
		}
		
		// 从相册选择图片，imageId:图片列表标志
		function appendByGallery(){
			plus.gallery.pick(function(path){
				// if(type == 1){
				// 	appendFile(path.files[0]);
				// }else{
				// 	zipFile(path.files[0]);
				// }
				zipFile(path.files[0]);
			},function(error) {
		 		alert( "Capture image failed: " + error.message );
			},{filename:"file:///storage/sdcard0/DCIM/Camera/"+"ra/",multiple:true,maximum:1,system:false});
		}
		
		function appendFile(path){
			plus.nativeUI.showWaiting("图片上传中......");
			var task = plus.uploader.createUpload( url, {}, function ( t, status ) {
				// 上传完成
				plus.nativeUI.closeWaiting(); 
				 
				if ( status == 200 ) {
					console.log(t);
					var result = JSON.parse(t.responseText);
					cb && cb(result);
				} else {
					alert( "Upload failed: " + status );
				}
				
			});
			task.addFile( path, {key:"file"} );
			task.start();
			
		}
		
		function zipFile(path){
			plus.nativeUI.showWaiting("图片加载中......");
			//图片方向
			var Orientation;
			  var img = new Image();
			img.src = path;
			src = path;
			img.onload = function () {
				var that = this;
				//生成比例 
				var w = that.width,
				h = that.height,
				scale = w / h; 
		        w = 640;  //480  你想压缩到多大
				h = w / scale;
				//生成canvas
				var canvas = document.createElement('canvas');
				
				var ctx = canvas.getContext('2d');
				// $(canvas).attr({width : w, height : h});
			
				canvas.setAttribute('width', w);
				canvas.setAttribute('height', h);
				
				
				//获取照片方向角属性，用户旋转控制 ,判断当前图片是否需要做旋转操作。
				EXIF.getData(img, function() {
					EXIF.getAllTags(this);   
					/**
					 * 图片的旋转方向信息
					 * 1、图片没有发生旋转
					 * 6、顺时针90°
					 * 8、逆时针90°
					 * 3、180° 旋转
					 */
					Orientation = EXIF.getTag(this, 'Orientation');
					// if(Orientation != "" && Orientation != null) {
					// 	// 方向信息，canvas 显示形式，canvas 对象，that,宽度，高度
					// 	rotateImg(Orientation,ctx,canvas,that,w,h);
					// }else {
					// 	rotateImg(Orientation,ctx,canvas,that,w,h);
					// }
					rotateImg(Orientation,ctx,canvas,that,w,h);
				});
		
			}
		}
		
		// 图片旋转操作
		function rotateImg(Orientation,ctx,canvas,that,w,h) {
			if(Orientation == "6") {
				// $(canvas).attr({width : w/2, height : h});
				canvas.setAttribute('width', w / 3);
				canvas.setAttribute('height', h);
				ctx.translate(270, 0);
				var angle = 90;
				//清空画布指定像素
				ctx.clearRect(-w, -h, w, h); 
				// 画布旋转 90度
				ctx.rotate(angle * Math.PI / 180);
				ctx.fillRect(w, h, w, h);
			}
			//向画布上绘制图像、画布或视频
			ctx.drawImage(that, 0, 0, w, h);
		
			
			

			canvas.toBlob(function(blob) {
				var formData = new FormData();
				formData.append('file', blob, 'canvas.jpg');
				mui.ajax(url, {
					data: formData,
					dataType:'json',//服务器返回json格式数据
					type:'post',//HTTP请求类型
					timeout: '10000',//超时时间设置为10秒          
					contentType: false,
					processData: false,
					success: function (data) {
						console.log(data);
						plus.nativeUI.closeWaiting();
						cb && cb(data);
					},
					error: function(xhr,type,errorThrown){
						//异常处理；
						console.log(type);
					}
				});	
				//然后把这个formData扔给ajax就好了。babababa
			});
			// 后台不支持base64
			// var base64 = canvas.toDataURL('image/jpeg', 0.8 );   //1z 表示图片质量，越低越模糊。
			
			// formdata.append('file',base64);
			//后台暂时不支持base64保存图片
			
		}
		
	}
	
	
	
	/**
	 * 本地数据保存
	 * @param {String} key
	 * @param {String} value  
	 */
	w.infoSet = function(key, value) {
		window.localStorage.setItem(key, value);
	}

	w.infoRem = function(key) {
		window.localStorage.removeItem(key);
	}
	w.infoGet = function(key) {
		return window.localStorage.getItem(key);
  }
  w.infoClear = function() {
    window.localStorage.clear();
  }
	w.toast = function (res) {
		mui.toast(res.message, {duration: 'long', type: 'div'});
	}
	// 对象属性转为驼峰
	w.transformKeyHump = function(obj) {
		let newObj = {};
		var DOWNLINEREG = /_([a-zA-Z])/g;
		Object.keys(obj).forEach(key => {
		  let newKey = key.replace(DOWNLINEREG, ($0, $1) => $1.toUpperCase());
		  newObj[newKey] = obj[key];
		});
		return newObj;
	},
	// 获取类型
	w.getType = function (obj) {
		return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
	};
	
	// 判断类型
	w.isType = function(obj, type) {
		if (getType(type) !== 'string') {
			throw new Error('type param must be string in util.js');
		}
		return getType(obj) === type;
	};

	// Promise封装
	w.pm = function (apiFunc, form, successCb, errorCb, middleCb) {
		if (apiFunc === 'unique') {
			setTimeout(function() {
				successCb && successCb();
			}, 100);
		} else {
			return apiFunc(form)
			.then(function(res) {
				if (res.code === 0) { // 
					successCb && successCb(res);
				} else {
					if (middleCb) {
						middleCb(res);
					} else {
						mui.toast(res.message, {duration: 'long', type: 'div'});
					}
					
				}
			})
			.catch(function (err) {
				console.log(err); 
				console.log('错误发生');
				errorCb && errorCb(err);
			})
		}
		
	}
	// 兼容性样式调整
	var adjust = false;
	function compatibleAdjust() {
		if (adjust || !w.plus || !domready) {
			return;
		}	// iOS平台使用滚动的div
		if ('iOS' == plus.os.name) {
			var t = document.getElementById("dcontent");
			t && (t.className = "sdcontent");
			t = document.getElementById("content");
			t && (t.className = "scontent");
			//iOS8横竖屏切换div不更新滚动问题
			var lasto = window.orientation;
			window.addEventListener("orientationchange", function () {
				var nowo = window.orientation;
				if (lasto != nowo && (90 == nowo || -90 == nowo)) {
					window.dcontent && (0 == dcontent.scrollTop) && (dcontent.scrollTop = 1);
					window.content && (0 == content.scrollTop) && (content.scrollTop = 1);
				}
				lasto = nowo;
			}, false);
		}
		adjust = true;
	};
	w.compatibleConfirm = function () {
		plus.nativeUI.confirm('本OS原生层面不提供该控件，需使用mui框架实现类似效果。请点击“确定”下载Hello mui示例', function (e) {
			if (0 == e.index) {
				plus.runtime.openURL("http://www.dcloud.io/hellomui/");
			}
		}, "", ["确定", "取消"]);
	}
	// 通用元素对象
	var _dout_ = null, _dcontent_ = null;
	w.gInit = function () {
		_dout_ = document.getElementById("output");
		_dcontent_ = document.getElementById("dcontent");
	};
	// 清空输出内容
	w.outClean = function () {
		_dout_.innerText = "";
		_dout_.scrollTop = 0;//在iOS8存在不滚动的现象
	};
	// 输出内容
	w.outSet = function (s) {
		_dout_.innerText = s + "\n";
		(0 == _dout_.scrollTop) && (_dout_.scrollTop = 1);//在iOS8存在不滚动的现象
	};
	// 输出行内容
	w.outLine = function (s) {
		_dout_.innerText += s + "\n";
		(0 == _dout_.scrollTop) && (_dout_.scrollTop = 1);//在iOS8存在不滚动的现象
	};
	// 格式化时长字符串，格式为"HH:MM:SS"
	w.timeToStr = function (ts) {
		if (isNaN(ts)) {
			return "--:--:--";
		}
		var h = parseInt(ts / 3600);
		var m = parseInt((ts % 3600) / 60);
		var s = parseInt(ts % 60);
		return (ultZeroize(h) + ":" + ultZeroize(m) + ":" + ultZeroize(s));
	};
	// 格式化日期时间字符串，格式为"YYYY-MM-DD HH:MM:SS"
	w.dateToStr = function (d) {
		return (d.getFullYear() + "-" + ultZeroize(d.getMonth() + 1) + "-" + ultZeroize(d.getDate()) + " " + ultZeroize(d.getHours()) + ":" + ultZeroize(d.getMinutes()) + ":" + ultZeroize(d.getSeconds()));
	};
	/**
	 * zeroize value with length(default is 2).
	 * @param {Object} v
	 * @param {Number} l
	 * @return {String} 
	 */
	w.ultZeroize = function (v, l) {
		var z = "";
		l = l || 2;
		v = String(v);
		for (var i = 0; i < l - v.length; i++) {
			z += "0";
		}
		return z + v;
	};
})(window);

; (function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function () { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function (type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function (type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function (event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function (target) {
		switch (target.nodeName.toLowerCase()) {

			// Don't send a synthetic click to disabled inputs (issue #62)
			case 'button':
			case 'select':
			case 'textarea':
				if (target.disabled) {
					return true;
				}

				break;
			case 'input':

				// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
				if ((deviceIsIOS && target.type === 'file') || target.disabled) {
					return true;
				}

				break;
			case 'label':
			case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
			case 'video':
				return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function (target) {
		switch (target.nodeName.toLowerCase()) {
			case 'textarea':
				return true;
			case 'select':
				return !deviceIsAndroid;
			case 'input':
				switch (target.type) {
					case 'button':
					case 'checkbox':
					case 'file':
					case 'image':
					case 'radio':
					case 'submit':
						return false;
				}

				// No point in attempting to focus disabled inputs
				return !target.disabled && !target.readOnly;
			default:
				return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function (targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function (targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function (targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function (targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function (event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function (event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function (event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function (labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function (event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function () {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function (event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function (event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function () {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function (layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

				// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function (layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function () {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}

	document.addEventListener('DOMContentLoaded', function () {
		FastClick.attach(document.body);
	}, false);

}());
