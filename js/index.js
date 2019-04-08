var adverts = [{
    serial_number: 'A459',
    poi_name: 'A459 环城公路与逢甲大道汇合圆盘处',
    cover: './resource/advert-pic/01/1.jpg',
    img: ['./resource/advert-pic/01/1.jpg', './resource/advert-pic/01/2.jpg', './resource/advert-pic/01/3.jpg', './resource/advert-pic/01/4.jpg', './resource/advert-pic/01/5.jpg'],
    name: 'A459 环城公路与逢甲大道汇合圆盘处',
    company: '城市综合管理局',
    legal_person: '陈二',
    telephone: '13719984494',
    address: '逢甲公园(兴宁县兴宁县南门路)',
    type: '普通',
    standard: '单面',
    update_time: '2018年02月18日',
    has_leader: '否',
    content: '以习近平新时代中国特色社会主义思想为指导',
    lng: 116.177661,
    lat: 24.655382
}, {
    serial_number: 'B001',
    poi_name: 'B001 锡林公园长兴路北',
    cover: './resource/advert-pic/02/1.jpg',
    img: ['./resource/advert-pic/02/1.jpg', './resource/advert-pic/02/2.jpg', './resource/advert-pic/02/3.jpg', './resource/advert-pic/02/4.jpg'],
    name: 'B001 锡林公园长兴路北',
    company: '县发展和改革局',
    legal_person: '李四',
    telephone: '13502333033',
    address: '锡林公园(兴宁县兴宁县锡林公园长兴路北)',
    type: '普通',
    standard: '单面',
    update_time: '2018年05月30日',
    has_leader: '否',
    content: '反邪教警示教育宣传栏',
    lng: 116.173569,
    lat: 24.658689
}, {
    serial_number: 'C001',
    poi_name: 'C001 溪峰西路85',
    cover: './resource/advert-pic/03/1.jpg',
    img: ['./resource/advert-pic/03/1.jpg', './resource/advert-pic/03/2.jpg', './resource/advert-pic/03/3.jpg'],
    name: 'C001 溪峰西路85',
    company: '县发展和改革局',
    legal_person: '王五',
    telephone: '13502371119',
    address: '兴宁县蕉城镇政府(兴宁县溪峰西路85)',
    type: '普通',
    standard: '单面',
    update_time: '2018年04月29日',
    has_leader: '否',
    content: '打一场扫黑除恶的人民战争',
    lng: 116.172499,
    lat: 24.659577
}, {
    serial_number: 'D001',
    poi_name: 'D001 府前钟楼',
    cover: './resource/advert-pic/04/1.jpg',
    img: ['./resource/advert-pic/04/1.jpg', './resource/advert-pic/04/2.jpg', './resource/advert-pic/04/3.jpg'],
    name: 'D001 府前钟楼',
    company: '县发展和改革局',
    legal_person: '赵六',
    telephone: '13823879873',
    address: '米乐星量贩式KTV(兴宁店)',
    type: '普通',
    standard: '单面',
    update_time: '2018年01月09日',
    has_leader: '否',
    content: '富强民族文明和谐等24个字',
    lng: 116.169539,
    lat: 24.658986
}, {
    serial_number: 'E001',
    poi_name: 'E001 桃源东路15',
    cover: './resource/advert-pic/05/1.jpg',
    img: ['./resource/advert-pic/05/1.jpg', './resource/advert-pic/05/2.jpg', './resource/advert-pic/05/3.jpg'],
    name: 'E001 桃源东路15',
    company: '县发展和改革局',
    legal_person: '刘一',
    telephone: '13536730245',
    address: '龙腾大厦(兴宁县兴宁县桃源东路15)',
    type: '普通',
    standard: '双面',
    update_time: '2018年03月21日',
    has_leader: '否',
    content: '创建广东省食品安全示范县',
    lng: 116.16558,
    lat: 24.657855
}, {
    serial_number: 'F456',
    poi_name: 'F456 龙门广场对面遇见奶茶店楼顶',
    cover: './resource/advert-pic/06/1.jpg',
    img: ['./resource/advert-pic/06/1.jpg', './resource/advert-pic/06/2.jpg', './resource/advert-pic/06/3.jpg', './resource/advert-pic/06/4.jpg'],
    name: 'F456 龙门广场对面遇见奶茶店楼顶',
    company: '城市综合管理局',
    legal_person: '张三',
    telephone: '13825975960',
    address: '兴宁中学(兴宁县兴宁县镇山路41)',
    type: '普通',
    standard: '单面',
    update_time: '2018年04月10日',
    has_leader: '否',
    content: '决胜全面建成小康社会',
    lng: 116.179016,
    lat: 24.666538
}];

var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

function getAdvert(poiName) {
    for (var i = 0; i < adverts.length; i++) {
        if (adverts[i].poi_name == poiName)
            return adverts[i];
    }
    return false;
}

var drawRoute = function(map, destPoint) {

    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
			r.point.lat=115.7397958375;
			r.point.lng=24.1527695783;
            var mk = new BMap.Marker(r.point);
            // map.addOverlay(mk);
            // map.panTo(r.point);
            console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
            // 绘制路线图
            var driving = new BMap.DrivingRoute(map, {
                renderOptions: {
                    map: map,
                    panel: "results",
                    autoViewport: true
                }
            });
            driving.search(r.point, destPoint)
        } else {
            console.log('failed' + this.getStatus());
        }
    });
}

apiready = function() {
    var header = $api.dom('header');
    var headerH = $api.fixStatusBar(header);
    $('<div style="position:fixed;top:0;width:100%;height:' + (headerH - 1) + 'px;background-color:#fff;z-index:9999;"></div>').appendTo('div.ct');
    $('div[data-role="header"]').css({'margin-top': headerH + 'px'});
    //console.log(headerH);
    api.setStatusBarStyle({
        style: 'dark'
    });

//window.onload = function() {

    $('div.ct').css('display', 'block');

    $('[data-href]').bind('click', function() {
        var href = $(this).attr('data-href');
        location.href = href;
    });
    $('a[href="#back"]').bind('click', function() {
        history.back();
    });

    //$('div.ct').css('display', 'block');

    var footerH = $('[data-role="footer"]').height();
    var contentH = $('[data-role="content"]').height();
    $('[data-role="content"]').css({
        'margin-bottom': (footerH) + 'px',
        'height': (contentH - footerH) + 'px'
    });
    //console.log(footerH);

    if (typeof(init) != 'undefined') {
        init();
    }

};
