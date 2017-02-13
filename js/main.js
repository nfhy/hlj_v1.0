/*!
 *
 * Naut - Bootstrap Admin Theme + AngularJS
 *
 * Author: @geedmo
 * Website: http://geedmo.com
 * License: https://wrapbootstrap.com/help/licenses
 *
 */

angular
    .module('naut', [
        'ngRoute',
        'ngAnimate',
        'ngStorage',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.bootstrap',
        'ui.router',
        'ui.select',
        'oc.lazyLoad',
        'cfp.loadingBar',
        'infinite-scroll'
    ]);

/**
 * Created by wangll on 2017/2/9.
 */
(function() {
    'use strict';

    angular.module('naut')
        .service('cacheService', cacheService);

    cacheService.$inject = ['$rootScope', '$cacheFactory'];

    function cacheService($rootScope, $cacheFactory) {

        var _prefix_college = '_c_';
        var _prefix_batch = '_p_';
        var _prefix_major = '_m_';
        var _key_joint = '#';

        function _init() {//初始化
            $rootScope.appCache = $cacheFactory('appCache');
        }

        function _clear(key) {
            if (key) {
                $rootScope.appCache.remove(key);
            }else {
                $rootScope.appCache.removeAll();
            }
        }

        function _put(key, data) {
            $rootScope.appCache.put(key, data);
        }

        function _get(key) {
            return $rootScope.appCache.get(key) || {};
        }

        return {
            init: _init,
            put: _put,
            get: _get,
            clear: _clear,
            prefix: {
                college: _prefix_college,
                major: _prefix_major,
                batch: _prefix_batch,
                joint: _key_joint
            }
        }

    }
})();
/**
 * Created by wangll on 2017/2/9.
 */
(function() {
    'use strict';

    angular.module('naut')
        .service('localStorageHandlerService', localStorageHandlerService);

    localStorageHandlerService.$inject = ['$rootScope'];

    function localStorageHandlerService($rootScope) {

        var _prefix_college = '_c_';
        var _prefix_batch = '_p_';
        var _prefix_major = '_m_';
        var _key_joint = '#';

        function _init() {//初始化
            $rootScope.$storage.$default({
                localData: {}
            });
        }

        function _clear() {
            //实现方式 待定
        }

        //批量缓存数据，支持Object格式或Array格式
        //参数变长，data 缓存数据，arg1 缓存前缀，arg2...argn 对应Array格式数据中的生成key值的属性名
        function _cacheDatas(data) {
            var prefix = arguments[1];
            if (!prefix) return;
            if (data) {
                if (_.isPlainObject(data)) {
                    for (var key in data) {
                        $rootScope.$storage.localData[prefix + key] = data[key];
                    }
                }
                else if (_.isArray(data)) {
                    var tags = _.slice(arguments, 2);
                    if (tags && tags.length >= 1) {
                        for (var index in data) {
                            var key = [];
                            for (var t in tags) {
                                key.push(data[index][tags[t]]);
                            }
                            if (key) {
                                $rootScope.$storage.localData[prefix + _.join(key, _key_joint)] = data[index];
                            }
                        }
                    }
                }
            }
        }

        //缓存单个数据
        //参数变长，data 缓存数据， arg1 缓存前缀， arg2...argn 生成缓存所需key值
        function _cacheData(data) {
            var prefix = arguments[1];
            if (!prefix) return;
            var keys = _.slice(arguments, 2);
            if (keys && keys.length >= 1) {
                if (data) {
                    var key = prefix + _.join(keys, _key_joint);
                    $rootScope.$storage.localData[key] = data;
                }
            }
        }

        //获取单个缓存数据
        //参数变长,prefix 缓存前缀 arg1...argn 生成缓存key值
        function _getCachedData(prefix) {
            var keys = _.slice(arguments, 1);
            if (keys && keys.length >=1) {
                return $rootScope.$storage.localData[prefix + _.join(keys, _key_joint)];
            }
        }

        function _batch(batchCode) {
            return _getCachedData(_prefix_batch, batchCode);
        }

        function _setBatch(batch) {
            return _cacheData(batch, _prefix_batch, batch.batchCode);
        }

        function _college(batchCode, collegeCode) {
            return _getCachedData(_prefix_college, batchCode, collegeCode);
        }

        function _major(batchCode, collegeCode, majorCode) {
            return _getCachedData(_prefix_major, batchCode, collegeCode, majorCode);
        }

        function _setCollege(batchCode, college) {
            return _cacheData(college, _prefix_college, batchCode, college.collegeCode);
        }

        function _setMajor(batchCode, collegeCode, major) {
            return _cacheData(major, _prefix_major, batchCode, collegeCode, major.majorCode);
        }

        return {
            init: _init,
            cacheDatas: _cacheDatas,
            cacheData: _cacheData,
            getCachedData: _getCachedData,
            clear: _clear,
            batch: _batch,
            setBatch: _setBatch,
            college: _college,
            major: _major,
            setCollege: _setCollege,
            setMajor: _setMajor,
            prefix: {
                college: _prefix_college,
                major: _prefix_major,
                batch: _prefix_batch,
                joint: _key_joint
            }
        };

    }
})();
/**
 * Created by wangll on 2017/2/13.
 */
(function() {
    'use strict';

    angular.module('naut')
        .controller('loginController', loginController);
    loginController.$inject = ['$state', '$localStorage'];
    function loginController($state, $localStorage) {
        var vm = this;

        vm.doLogin = _doLogin;

        function _doLogin() {
            $state.go('app.welcome');
        }
    }
})();
/**
 * Created by wangll on 2017/2/8.
 */
(function() {
    'use strict';

    angular.module('naut')
        .controller('noticesController', noticesController);

    noticesController.$inject = ['$timeout'];

    function noticesController($timeout) {
        var vm = this;

        vm.notices = [];
        _pollNotices();

        //functions↓
        function _pollNotices() {
            $timeout(function() {
                console.log('emulate poll notices from server');
            },500)
                .then(
                    function() {
                        var arr = [];
                        for (var i= 0; i<= 10; i++) {
                            arr.push({
                                title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题'+i,
                                url: 'http://www.baidu.com',
                                date: '2017-02-12 15:27:00'
                            });
                        }
                        vm.notices = arr;
                    }
                );
        }
    }
})();
/**
 * Created by wangll on 2017/2/8.
 */
function provinces() {
    var china = new Object();
    china['北京市'] = new Array('北京市区', '北京市辖区');
    china['上海市'] = new Array('上海市区', '上海市辖区');
    china['天津市'] = new Array('天津市区', '天津市辖区');
    china['重庆市'] = new Array('重庆市区', '重庆市辖区');
    china['河北省'] = new Array('石家庄', '唐山市', '邯郸市', '秦皇市岛', '保市定', '张家市口', '承德市', '廊坊市', '沧州市', '衡水市', '邢台市');
    china['山西省'] = new Array('太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市');
    china['辽宁省'] = new Array('沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市');
    china['吉林省'] = new Array('长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边州', '长白山管委会');
    china['黑龙江省'] = new Array('哈尔滨市', '齐齐哈尔市', '大庆市', '佳木斯市', '牡丹江市', '七台河市', '双鸭山市', '黑河市', '鸡西市', '伊春市', '绥化市', '鹤岗市', '加格达奇市');
    china['江苏省'] = new Array('南京市', '苏州市', '无锡市', '常州市', '南通市', '扬州市', '镇江市', '泰州市', '盐城市', '连云港市', '宿迁市', '淮安市', '徐州市');
    china['浙江省'] = new Array('杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市');
    china['安徽省'] = new Array('合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '巢湖市', '六安市', '亳州市', '池州市', '宣城市');
    china['福建省'] = new Array('福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市');
    china['江西省'] = new Array('南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市');
    china['山东省'] = new Array('济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '莱芜市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市');
    china['河南省'] = new Array('郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市');
    china['湖北省'] = new Array('武汉市', '黄石市', '十堰市', '荆州市', '宜昌市', '襄樊市', '鄂州市', '荆门市', '孝感市', '黄冈市', '咸宁市', '随州市');
    china['湖南省'] = new Array('长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市');
    china['广东省'] = new Array('广州市', '深圳市', '珠海市', '汕头市', '韶关市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市');
    china['海南省'] = new Array('文昌市', '琼海市', '万宁市', '五指山市', '东方市', '儋州市');
    china['四川省 '] = new Array('成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市');
    china['贵州省'] = new Array('贵阳市', '六盘水市', '遵义市', '安顺市');
    china['云南省'] = new Array('昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市');
    china['陕西省'] = new Array('西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市');
    china['甘肃省'] = new Array('兰州市', '金昌市', '白银市', '天水市', '嘉峪关市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市');
    china['青海省'] = new Array('西宁市');
    china['台湾省'] = new Array('台北市', '高雄市', '基隆市', '台中市', '台南市', '新竹市', '嘉义市');
    china['广西壮族自治区'] = new Array('南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市');
    china['内蒙古自治区'] = new Array('呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市');
    china['西藏自治区'] = new Array('拉萨市');
    china['宁夏回族自治区'] = new Array('银川市', '石嘴山市', '吴忠市', '固原市', '中卫市');
    china['新疆维吾尔自治区'] = new Array('乌鲁木齐市', '克拉玛依市');
    china['香港特别行政区'] = new Array('台北市', '高雄市', '基隆市', '台中市', '台南市', '新竹市', '嘉义市');
    var arr = [];
    var i = 0;
    for (var name in china) {
        arr.push({
            index: i++,
            name: name
        });
    }
    return arr;
}
/**
 * Created by wangll on 2017/2/7.
 */
(function(){
    'use strict';

    angular.module('naut')
        .service('timerService', timerService);

    timerService.$inject = ['$timeout', '$localStorage'];

    function timerService($timeout, $localStorage) {
        var endDateStr = '';
        var _secondsLeft = 0;
        var _minutesLeft = 0;
        var _hoursLeft = 0;
        var _daysLeft = 0;
        var secondInterval = 0;
        var _i_default = 5;
        var _i = 0;

        var _pollFromServer = function() {
            $timeout(function() {
                console.log('emulate timer polling');
            }, 500)
                .then(function() {
                    endDateStr = '2017-03-07 16:55:00';
                    $localStorage.endDateStr = endDateStr;
                    secondInterval = (new Date(endDateStr).getTime() - new Date().getTime())/1000 + parseInt(Math.random()*100, 10);
                });
        };

        var _counter = function() {
            _i --;
            if (_i <= 0) {
                _pollFromServer();//每_i_default秒校对一次服务器时间，异步执行，没有必要与下部代码强制同步
                _i = _i_default;
            }
            if (secondInterval <= 0) {
            }
            else {
                secondInterval--;
                _secondsLeft = parseInt(secondInterval % 60);
                _minutesLeft = parseInt((secondInterval/60) % 60);
                _hoursLeft = parseInt((secondInterval/(60*60)) % 24);
                _daysLeft = parseInt((secondInterval/(60*60*24)));

            }
            return {
                intervals: secondInterval,
                secondsLeft: _secondsLeft,
                minutesLeft: _minutesLeft,
                hoursLeft: _hoursLeft,
                daysLeft: _daysLeft
            };
        };//每秒执行一次


        var timer = {
            counter: _counter
        };
        return timer;
    }

})();
/**
 * Created by wangll on 2017/2/7.
 */
(function() {
    'use strict';

    angular.module('naut')
        .controller('welcomeController', welcomeController);

    welcomeController.$inject = ['cacheService', '$scope', '$interval', '$state', '$timeout', 'timerService'];

    function welcomeController(cacheService, $scope, $interval, $state, $timeout, timerService) {
        var vm = this;

        vm.conterDownText = '';
        vm.welcomeInfo = '欢迎您，XXX';
        vm.postEndDate = true;

        vm.editWishes = _editWishes;
        vm.viewWishes = _viewWishes;
        //刷新考生批次填报状态
        _pollBatchs();

        //functions↓

        function _pollBatchs() {
            $timeout(function() {
                console.log('emulate poll batchs from server');
            }, 500)
                .then(function() {
                    vm.batchs = [
                        {
                            batchName: '普通类本科一批',
                            batchCode: '1',
                            dirty: false,
                            collegeNum: 5,
                            majorNum: 6
                        },
                        {
                            batchName: '普通类本科二批',
                            batchCode: '2',
                            dirty: false,
                            collegeNum: 5,
                            majorNum: 6
                        },
                        {
                            batchName: '普通类专科一批',
                            batchCode: '3',
                            dirty: false,
                            collegeNum: 5,
                            majorNum: 6
                        },
                        {
                            batchName: '普通类专科二批',
                            batchCode: '4',
                            dirty: false,
                            collegeNum: 5,
                            majorNum: 6
                        },
                        {
                            batchName: '普通类中职',
                            batchCode: '5',
                            dirty: false,
                            collegeNum: 5,
                            majorNum: 6
                        }
                    ];
                    var arr = {};
                    for (var b in vm.batchs) {
                        arr[vm.batchs[b].batchCode] = vm.batchs[b];
                    }
                    cacheService.put(cacheService.prefix.batch, arr);
                });
        }

        //edit wishes
        function _editWishes(batch) {
            $state.go('app.zyEdit', {'batchCode': batch.batchCode, 'canEdit': 'e'});
        }

        function _viewWishes(batch) {
            $state.go('app.zyEdit', {'batchCode': batch.batchCode, 'canEdit': 'v'});
        }

        //每 _i 秒校对一次服务器时间
        //每秒倒计时，更新页面倒计时信息
        if (counter) {
            $interval.cancel(counter);
        }
        var counter = $interval(function() {
            var countDownTimer = timerService.counter();
            if(countDownTimer.intervals > 0) {
                vm.postEndDate = false;
                vm.conterDownText = '距离截止时间还有：'
                    + countDownTimer.daysLeft + '天'
                    + countDownTimer.hoursLeft + '小时'
                    + countDownTimer.minutesLeft + '分'
                    + countDownTimer.secondsLeft + '秒';
            }
            else if (countDownTimer.intervals < 0){
                vm.postEndDate = true;
                vm.conterDownText = '已过填报截止时间';
            }
        },1000);//每秒执行一次

        $scope.$on('$destroy',function(){
            console.log('stop counter');
            $interval.cancel(counter);
        });
    }
})();
/**
 * Created by wangll on 2017/2/8.
 */
(function() {
    'use strict';

    angular.module('naut')
        .controller('zyEditController', zyEditController);

    zyEditController.$inject = ['$scope', '$stateParams', 'cacheService', 'wishValidateService', 'zyStaticService', '$uibModal', '$timeout'];

    function zyEditController($scope, $stateParams, cacheService, wishValidateService, zyStaticService, $uibModal, $timeout) {
        var vm = this;

        vm.batchCode = $stateParams.batchCode;
        vm.isBusy = true; //本页面可能需要较长准备时间，数据获取和加载完成前，页面展示加载提示信息，通过busy属性控制信息显示与隐藏
        vm.noEdit = $stateParams.canEdit == 'v';
        vm.realWishes = [//扩展后的志愿数据，前端业务处理用
        ];
        vm.finalWishes = [];//用户点击保存按钮，将填报的志愿整理后获得的志愿数据，仍未压缩，通过验证后，在提交给服务器前进行压缩
        vm.checkResults = [];//用户点击保存按钮，先进性数据合法性验证，未通过验证，显示验证结果列表；通过验证，显示统计结果列表
        /**
         * @type {{batchCode: number, batchName: string, yxs: Number, yxzys: Number}}
         */
        vm.batch = {
            batchName: '普通类本科一批',
            batchCode: '1',
            dirty: false,
            collegeNum: 5,
            majorNum: 6
        };
        //cacheService.get(cacheService.prefix.batch)[vm.batchCode];
        cacheService.put('currentBatch', vm.batch);
        //模拟从服务器获取的最简计划数据，需要进行二次处理成为页面可直接用的数据
        vm.plainPlans =[
            '0001#北大#01#数学#02#历史#03#政治','0002#清华#01#文史#02#物理#03#哲学'
        ];
        //模拟从服务器获取的最简志愿数据，需要进行二次处理成为页面可直接用的数据
        vm.plainWishes = [
            [1, '1', ['01'], '0'],
            [2, '2', ['01', '02', '03'] ,'1'],
            [2, '2', ['01', '02', '03'] ,'1'],
            [2, '2', ['01', '02', '03'] ,'1'],
            [2, '2', ['01', '02', '03'] ,'1']
        ];
        _pollPlanPlans();

        vm.saveWishes = _saveWishes;

        //function ↓
        /**
         * 初始化考生志愿结构
         * @private
         */
        function _pollPlanPlans() {
            $timeout(function() {
                console.log('emulate poll plans from server');
                vm.plainPlans = [];
                for (var i= 0; i<= 20000; i++) {
                    vm.plainPlans.push(_.join([i, '院校' + i, '01', '数学', '02', '语文', '03', '物理', '04', '政治', '05', '哲学'],cacheService.prefix.joint));
                }
            },500)
                .then(
                    function() {
                        console.log(new Date().getTime());
                        _handlePlainPlans();
                        vm.realWishes = _fromPlain2RealWishes();
                        console.log(new Date().getTime());
                        vm.isBusy = false;
                    }
                );
        }

        //转换原始计划数据为页面可用数据结构
        function _handlePlainPlans() {
            var colleges = [];
            var majors = {};
            var plans = {};
            for (var index in vm.plainPlans) {
                var planInfo = vm.plainPlans[index].split(cacheService.prefix.joint);
                var college = {
                    collegeCode: planInfo[0],
                    collegeName: planInfo[1]
                };
                var major = [];
                for (var m= 2; m< planInfo.length; m= m+2) {
                    major.push({
                        majorCode: planInfo[m],
                        majorName: planInfo[m+1]
                    });
                }
                colleges.push(college);
                majors[college] = major;
                plans[college.collegeCode] = {
                    'college': college,
                    'major': major
                };
            }
            cacheService.put(cacheService.prefix.college + vm.batchCode, {
                'colleges': colleges,
                'majors': majors,
                'plans': plans
            });
        }

        function _saveWishes() {
            vm.finalWishes = _fromReal2FinalWishes(vm.realWishes);
            var validateResults = wishValidateService.validateWishes(vm.finalWishes);
            if (validateResults.dirty) {
                vm.checkResults = {
                    passValidation: false,
                    results: validateResults.results
                };
            }
            else {//static results
                vm.checkResults = {
                    passValidation: true,
                    results: zyStaticService.staticWishes(vm.finalWishes)
                };
            }
            _showZySubmitList();
        }

        function _confirmSave() {
            vm.isBusy = true;
            vm.plainWishes = _fromReal2PlainWishes();
            $timeout(function() {
            },1000)
                .then(function() {
                    vm.isBusy = false;
                });
        }

        //将压缩后的考生志愿扩展为页面可用的数据结构
        function _fromPlain2RealWishes() {
            var realWishes = [];
            var batchCode = vm.batch.batchCode;
            var collegeNum = vm.batch.collegeNum;
            var majorNum = vm.batch.majorNum;
            for (var i= 0; i< collegeNum; i++) {
                realWishes.push(
                    [i+1, undefined, _.times(majorNum, _.constant(undefined)), undefined]
                );
            }
            var plans = cacheService.get(cacheService.prefix.college + batchCode)['plans'];
            if (vm.plainWishes) {
                var filter = function(o) {return o['majorCode'] == majorCodes[m];};
                for (var index in vm.plainWishes) {
                    var realWish = realWishes[index];
                    var pw = vm.plainWishes[index];
                    var collegeCode = pw[1];
                    var majorCodes = pw[2];
                    var college = plans[collegeCode]['college'];
                    var majors = plans[collegeCode]['major'];
                    realWish[1] = college;
                    for (var m in majorCodes) {
                        var mindex = _.findIndex(majors, filter);
                        realWish[2][m] = majors[mindex];
                    }
                    realWish[3] = pw[3];
                }
            }
            return realWishes;
        }

        function _fromReal2FinalWishes() {
            var finalWishes = [];
            for(var index in vm.realWishes) {
                var realWish = vm.realWishes[index];
                var college = realWish[1];
                if (college == undefined) continue;
                var majors = _.filter(realWish[2], function(o) {return o!=undefined;});
                var finalWish = [realWish[0], college, majors, realWish[3]];
                finalWishes.push(finalWish);
            }
            return finalWishes;
        }

        //将扩展的考生志愿压缩为传输给服务器的数据结构
        function _fromReal2PlainWishes() {
            var plainWishes = [];
            for(var index in vm.realWishes) {
                var realWish = vm.realWishes[index];
                var college = realWish[1];
                if (!college) continue;
                var majors = realWish[2];
                var plainWish = [realWish[0], college.collegeCode, [], realWish[3]];
                for (var m in majors) {
                    if (!majors[m]) continue;
                    plainWish[2].push(majors[m].majorCode);
                }
                plainWishes.push(plainWish);
            }
            return plainWishes;
        }

        function _showZySubmitList() {
            //弹出收藏列表页面
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'zyValidate.html',
                controller: 'zySubmitCtrl',
                controllerAs: 'zysCtrl',
                size: 'lg',
                resolve: {
                    zysWishes: function () {
                        return vm.finalWishes;
                    },
                    results: function() {
                        return vm.checkResults;
                    }
                }
            });
            modalInstance.result.then(
                function() {
                    console.log('confirm submit');
                    _confirmSave();
                }
            );
        }
        //modalInstanceCtrl
        angular.module('naut')
            .controller('zySubmitCtrl', zySubmitCtrl);
        zySubmitCtrl.$inject = ['$scope', '$uibModalInstance', 'zysWishes', 'results'];
        function zySubmitCtrl($scope, $uibModalInstance, zysWishes, results) {
            var vm = this;
            vm.zysWishes = zysWishes;
            vm.results = results.results;
            vm.passValidation = results.passValidation;
            vm.closeZySubmit = _cancel;
            vm.confirmZySubmit = _ok;

            function _cancel() {
                $uibModalInstance.dismiss('cancel');
            }

            function _ok() {
                $uibModalInstance.close('close');
            }
        }

        //单个院校select的controller
        angular.module('naut')
            .controller('collegeSelectController', collegeSelectController);
        collegeSelectController.$inject = ['$scope', 'cacheService'];
        function collegeSelectController($scope, cacheService) {
            var cvm = this;
            cvm.batch = cacheService.get('currentBatch');
            cvm.batchCode = cvm.batch.batchCode;
            cvm.collegesForSelect = undefined;
            cvm.majorsForSelect = undefined;
            cvm.filteredColleges = undefined;
            cvm.isBusy = true;

            _prepareCollegeForSelect();

            cvm.refreshColleges = _.debounce(_refreshColleges, 500);
            cvm.clearCollege = _clear;
            cvm.collegeChange = _collegeChange;

            function _refreshColleges(collegeSearchStr) {
                $timeout(function() {
                    console.log('emulate poll filtered colleges from server');
                },0).then(function() {
                    cvm.isBusy = true;
                    var start = new Date().getTime();
                    var filteredColleges_ = [];
                    if (collegeSearchStr && collegeSearchStr.length >= 1) {
                        filteredColleges_.push({collegeCode: '', collegeName: ''});
                        for (var index in cvm.collegesForSelect) {
                            var college = cvm.collegesForSelect[index];
                            if (college.collegeName.indexOf(collegeSearchStr) >= 0) {
                                filteredColleges_.push(college);
                            }
                        }
                    }
                    console.log(new Date().getTime() - start);
                    cvm.filteredColleges = filteredColleges_;
                    cvm.isBusy = false;
                });
            }

            function _clear() {
                console.log('clear');
                if (!cvm.isBusy) {
                    $scope.wish[1] = undefined;
                    $scope.wish[3] = undefined;
                    $scope.wish[2] = _.times(cvm.batch.majorNum, _.constant(undefined));
                    cvm.majorsForSelect = undefined;//清空可选专业的选项
                }
            }

            function _prepareCollegeForSelect() {
                cvm.collegesForSelect = cacheService.get(cacheService.prefix.college + cvm.batchCode)['colleges'];
                var college = $scope.wish[1];
                if (college && college.collegeCode) {
                    cvm.majorsForSelect = cacheService.get(cacheService.prefix.college + cvm.batchCode)['majors'][college];
                }
            }

            function _collegeChange() {
                var college = $scope.wish[1];
                $scope.wish[3] = undefined;
                $scope.wish[2] = _.times(cvm.batch.majorNum, _.constant(undefined));
                cvm.majorsForSelect = cacheService.get(cacheService.prefix.college + cvm.batchCode)['majors'][college];
            }
        }
    }

})();
/**
 * Created by wangll on 2017/2/12.
 */
(function() {
    'use strict';

    angular.module('naut')
        .service('zyStaticService', zyStaticService);
    zyStaticService.$inject = [];
    function zyStaticService() {
        function _staticOneWish(wish) {
            return wish[2].length;
        }

        function _staticWishes(wishes) {
            var arr ={
                totalCollegeNum: 0,
                totalMajorNum: 0,
                results: []
            };
            for (var w in wishes) {
                var majorNum = _staticOneWish(wishes[w]);
                arr.totalCollegeNum ++;
                arr.totalMajorNum += majorNum;
                arr.results.push(majorNum);
            }
            return arr;
        }

        return {
            staticWishes: _staticWishes
        };
    }
})();
/**
 * Created by wangll on 2017/2/10.
 */
(function() {
    'use strict';
    angular.module('naut')
        .service('wishValidateService', wishValidateService);
    wishValidateService.$inject = [];
    function wishValidateService() {

        var _msg = {
            0: '通过验证',
            1: '单条志愿为空',//逻辑上不会出现的情况
            2: '未填报院校',
            3: '未填报专业',
            4: '未选择专业调剂',
            5: '未填报志愿'
        };

        var _getMsg = function(m) {
            return _msg[m];
        };

        var _validateOneWish = function(wish) {
            var result = {
                dirty: false,//是否有错
                collegeError: undefined,//college error
                majorError: undefined,//major error
                obeyError: undefined,//obey error
                specialError: undefined,//for expand
                toString: function() {
                    if (this.dirty) {
                        return _.join(_.filter([this.collegeError, this.majorError, this.obeyError, this.specialError], function(o) {return o != undefined;}), ',');
                    }
                    else {
                        return _getMsg(0);
                    }
                }

            };
            var college = wish[1];
            var majors = wish[2];
            var obey = wish[3];

            if (!college) {
                result.dirty = true;
                result.collegeError = _getMsg(2);
            }

            if (!(majors && majors.length >= 1)) {
                result.dirty = true;
                result.majorError = _getMsg(3);
            }
            if (!obey) {
                result.dirty = true;
                result.obeyError = _getMsg(4);
            }
            return result;
        };

        var _validateAllWishes = function(wishes) {
            var results = {
                dirty: false,
                results: []
            };
            for (var w in wishes) {
                var result = _validateOneWish(wishes[w]);
                results.dirty = results.dirty || result.dirty;
                results.results.push(result);
            }
            return results;
        };

        return  {
            validateWishes: _validateAllWishes
        }
    }
})();
/**
 * Created by wangll on 2017/2/7.
 */
(function() {
    'use strict';

    angular.module('naut')
        .controller('zyQueryController', zyQueryController);

    zyQueryController.$inject = ['$uibModal', '$localStorage', '$timeout'];

    function zyQueryController($uibModal, $localStorage, $timeout) {
        var vm = this;


        //查询条件 start
        vm.q_yx = '';//院校
        vm.q_zy = '';//专业
        vm.q_sf = '';//省份
        vm.q_kl = '';//科类
        vm.q_batch = '';//批次
        //查询条件 end

        vm.results = [];
        vm.provinces = provinces();
        vm.batchs = [
            {
                batchCode: '0',
                batchName: '普通类本科一批'
            },
            {
                batchCode: '1',
                batchName: '普通类本科二批'
            },
            {
                batchCode: '2',
                batchName: '普通类专科一批'
            },
            {
                batchCode: '3',
                batchName: '普通类专科二批'
            },
            {
                batchCode: '4',
                batchName: '普通类专科高职'
            }
        ];
        vm.kls = [
            {
                kldm: '0',
                klmc: '理工'
            },
            {
                kldm: '1',
                klmc: '文史'
            }
        ];
        vm.favs = $localStorage.favs||'';
        vm.favs_jh = $localStorage.favs_jh||{};

        vm.q_up = true;
        vm.emptyResult = true;
        vm.tmp_counter = 0;
        //functions↓
        vm.queryResult = _queryResult;
        vm.pollResult = _moreResult;
        vm.favo = _favo;
        vm.showFavsList = _showFavsList;
        //查询数据
        function _queryResult() {
            vm.results = [];
            _moreResult();
        }
        //滚轮划至页面底部，自动加载新数据
        function _moreResult() {
            $timeout(function() {
                console.log('emulate poll zyResults from server');
            },500)
                .then(
                    function() {
                        if (vm.tmp_counter >= 5) {
                            vm.emptyResult = true;
                        }
                        else {
                            var arr = [];
                            for (var j = 1; j < 50; j++) {
                                var i = j + 50 * vm.tmp_counter;
                                arr.push([
                                    '' + i % 4, '批次' + i % 5,//批次
                                    '' + i % 20, '院校' + i % 20,//院校
                                    '' + i % 10, '专业' + i % 10,//专业
                                    '' + i % 5, '省份' + i % 5,//省份
                                    '4',//年制
                                    '5500',//学费
                                    i % 2 ? '文史' : '理工',//科类
                                    '备注' + i,
                                    i
                                ]);
                            }
                            vm.results = vm.results.concat(arr);
                            vm.tmp_counter++;
                            vm.emptyResult = false;
                        }
                    }
                );
        }

        //添加计划至收藏栏
        function _favo(jh) {
            var key = '#' + jh[12];
            if (vm.favs.indexOf(key) >= 0) {
                vm.favs = vm.favs.replace(key, '');
                delete vm.favs_jh[key];
            }
            else {
                vm.favs += key;
                vm.favs_jh[key] = jh;
            }
            $localStorage.favs = vm.favs;
            $localStorage.favs_jh = vm.favs_jh;
        }

        function _showFavsList() {
            //弹出收藏列表页面
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'favsList.html',
                controller: 'favsListCtrl',
                controllerAs: 'fCtrl',
                size: 'lg',
                resolve: {
                    favs_jh: function () {
                        return vm.favs_jh;
                    }
                }
            });
        }
    }

//modalInstanceCtrl
    angular.module('naut')
        .controller('favsListCtrl', favsListCtrl);
    favsListCtrl.$inject = ['$uibModalInstance', 'favs_jh'];
    function favsListCtrl($uibModalInstance, favs_jh) {
        var vm = this;
        vm.favs_jh = favs_jh;
    }
})();


/**=========================================================
 * Module: ColorsConstant.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .constant('COLORS', {
            // Same values from CSS
            'primary':                '#3F51B5',
            'success':                '#4caf50',
            'info':                   '#2095f2',
            'warning':                '#fe9700',
            'danger':                 '#f34235',
            'inverse':                '#363f45',
            'amber':                  '#FFC107',
            'pink':                   '#e91e63',
            'purple':                 '#6639b6',
            'orange':                 '#fe5621',
            'noir':                   '#212121',
            'white':                  '#fff',
            'gray-darker':            '#2b3d51',
            'gray-dark':              '#515d6e',
            'gray':                   '#A0AAB2',
            'gray-light':             '#e6e9ee',
            'gray-lighter':           '#f4f5f5'
        });
})();

/**=========================================================
 * Module: ColorsRun
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .run(appRun);

    appRun.$inject = ['$rootScope', 'colors'];
    function appRun($rootScope, colors) {
      // Request brand colors from templates e.g {{colorByName('info')}}
      $rootScope.colorByName = colors.byName;
    }

})();

/**=========================================================
 * Module: ColorsService.js
 * Services to retrieve global colors
 =========================================================*/
 
(function() {
    'use strict';

    angular
        .module('naut')
        .factory('colors', colors);
    
    colors.$inject = ['COLORS'];
    function colors(COLORS) {

      return {
        byName: function(name) {
          return (COLORS[name] || '#fff');
        }
      };
    }

})();
/**=========================================================
 * Module: CoreConfig
 =========================================================*/
(function () {
  'use strict';

  angular
    .module('naut')
    .config(commonConfig)
    .config(lazyLoadConfig);

  // Common object accessibility
  commonConfig.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide'];
  function commonConfig($controllerProvider, $compileProvider, $filterProvider, $provide) {

    var app = angular.module('naut');
    app.controller = $controllerProvider.register;
    app.directive  = $compileProvider.directive;
    app.filter     = $filterProvider.register;
    app.factory    = $provide.factory;
    app.service    = $provide.service;
    app.constant   = $provide.constant;
    app.value      = $provide.value;

  }

  // Lazy load configuration
  lazyLoadConfig.$inject = ['$ocLazyLoadProvider', 'VENDOR_ASSETS'];
  function lazyLoadConfig($ocLazyLoadProvider, VENDOR_ASSETS) {

    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: VENDOR_ASSETS.modules
    });

  }

})();



/**=========================================================
 * Module: ColorsConstant.js
 =========================================================*/

(function() {
  'use strict';

  // Same MQ as defined in the css
  angular
    .module('naut')
    .constant('MEDIA_QUERY', {
      'desktopLG': 1200,
      'desktop':   992,
      'tablet':    768,
      'mobile':    480
    });

})();

/**=========================================================
 * Module: CoreController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('CoreController', CoreController);

    /* @ngInject */
    function CoreController($rootScope) {
      // Get title for each page
      $rootScope.pageTitle = function() {
        return $rootScope.app.name + ' - ' + $rootScope.app.description;
      };

      // Cancel events from templates
      // ----------------------------------- 
      $rootScope.cancel = function($event){
        $event.preventDefault();
        $event.stopPropagation();
      };
      $rootScope.showMask = false;
    }
    CoreController.$inject = ['$rootScope'];

})();

/**=========================================================
 * Module: ApplicationRun.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .run(appRun);


    appRun.$inject = ['$rootScope', '$state', '$stateParams', '$localStorage', 'settings', 'browser', 'cacheService'];
    function appRun($rootScope, $state, $stateParams, $localStorage, settings, browser, cacheService) {

        // Set reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$storage = $localStorage;

        settings.init();
        cacheService.init();

        // add a classname to target different platforms form css
        var root = document.querySelector('html');
        root.className += ' ' + browser.platform;

    }

})();


/**=========================================================
 * Module: HeaderNavController
 * Controls the header navigation
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('HeaderNavController', HeaderNavController);
    /* @ngInject */
    function HeaderNavController($rootScope) {
        var vm = this;

        vm.srefs = [
            {
                url: 'app.welcome',
                title: '首页',
                active: false
            },
            {
                url: 'app.agreement',
                title: '考生须知',
                active: false
            },
            {
                url: 'app.zyQuery',
                title: '计划查询',
                active: false
            },
            {
                url: 'app.notices',
                title: '通知消息',
                active: false
            },
            {
                url: 'login',
                title: '安全登出',
                active: false
            }
        ];
        vm.headerMenuCollapsed = true;
        vm.menuClick = _menuClick;

        vm.toggleHeaderMenu = function() {
            vm.headerMenuCollapsed = !vm.headerMenuCollapsed;
        };

        // Adjustment on route changes
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            vm.headerMenuCollapsed = true;
        });

        function _menuClick(sref) {
            for (var s in vm.srefs) {
                vm.srefs[s].active = false;
                if (vm.srefs[s].title == sref.title) {
                    vm.srefs[s].active = true;
                }
            }
        }

    }
    HeaderNavController.$inject = ['$rootScope'];

})();

/**=========================================================
 * Module: LoadingBarConfig.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .config(loadingBarConfig);
    
    /* @ngInject */
    function loadingBarConfig(cfpLoadingBarProvider) {
      cfpLoadingBarProvider.includeBar = true;
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.latencyThreshold = 500;
      cfpLoadingBarProvider.parentSelector = '.app-container > header';
    }
    loadingBarConfig.$inject = ['cfpLoadingBarProvider'];

})();


/**=========================================================
 * Module: LoadingbarRun
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .run(appRun);
    /* @ngInject */
    function appRun($rootScope, $timeout, cfpLoadingBar) {
      // Loading bar transition

      var latency;
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          if( document.querySelector('.app-container > section') ) // check if bar container exists
            latency = $timeout(function() {
              cfpLoadingBar.start();
            }, 50); // sets a latency Threshold
      });
      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          event.targetScope.$watch('$viewContentLoaded', function () {
            $timeout.cancel(latency);
            cfpLoadingBar.complete();
          });
      });

    }
    appRun.$inject = ['$rootScope', '$timeout', 'cfpLoadingBar'];

})();

/**=========================================================
 * Module: RippleDirective.js
 * Adapted to support bootstrap components
 * Based on: https://github.com/nelsoncash/angular-ripple
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .directive('ripple', ripple);
    /* @ngInject */
    function ripple($timeout) {

      return {
        restrict: 'A',
        link: link
      };

      function link (scope, element, attrs) {
        var x, y, size, offsets;

        element.append('<span class="ripple"></span>');

        element.on('click touchstart', function(e) {
          var eventType = e.type;
          
          var rippleContainer = this.querySelector('.ripple');
          var ripple = rippleContainer.querySelector('.angular-ripple');

          // Ripple
          if (ripple === null) {
            // Create ripple
            ripple = document.createElement('span');
            ripple.className = 'angular-ripple';

            // Prepend ripple to element
            rippleContainer.insertBefore(ripple, rippleContainer.firstChild);

            // Set ripple size
            if (!ripple.offsetHeight && !ripple.offsetWidth) {
              size = Math.max(rippleContainer.offsetWidth, rippleContainer.offsetHeight);
              ripple.style.width = size + 'px';
              ripple.style.height = size + 'px';
            }
          }

          // create jqlite reference
          var $ripple = angular.element(ripple);
          // Remove animation effect
          $ripple.removeClass('animate');

          // get click coordinates by event type
          if (eventType === 'click') {
            x = e.pageX;
            y = e.pageY;
          } else if(eventType === 'touchstart') {
            x = e.changedTouches[0].pageX;
            y = e.changedTouches[0].pageY;
          }

          // set new ripple position by click or touch position
          function getPos(el) {
            for (var lx=0, ly=0; el !== null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
            return {left: lx, top: ly};
          }

          offsets = offset( $ripple.parent()[0] );

          ripple.style.left = (x - offsets.left - size / 2) + 'px';
          ripple.style.top = (y - offsets.top - size / 2) + 'px';

          // Add animation effect
          $ripple.addClass('animate');
          
          $timeout(function(){
            $ripple.removeClass('animate');
          }, 500);

        });
      }

      // helpers
      function offset(el) {
        var rect = el.getBoundingClientRect();
        return {
          top: rect.top + document.body.scrollTop,
          left: rect.left + document.body.scrollLeft
        };
      }      
    }
    ripple.$inject = ['$timeout'];

})();

/**=========================================================
 * Module: RoutesConfig.js
 =========================================================*/

(function() {
  'use strict';

  angular
      .module('naut')
      .config(routesConfig);

  routesConfig.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', 'RouteProvider'];
  function routesConfig($locationProvider, $stateProvider, $urlRouterProvider, Route) {

    // use the HTML5 History API
    $locationProvider.html5Mode(false);

    // Default route
    $urlRouterProvider.otherwise('/app/welcome');

    // Application Routes States
    $stateProvider
        .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: Route.base('app.html')
        })
        .state('app.welcome', {
            url: '/welcome',
            templateUrl: Route.base('pages/welcome.html')
        })
        .state('app.agreement', {
            url: '/agreement',
            templateUrl: Route.base('pages/agreement.html')
        })
        .state('app.zyQuery', {
            url: '/zyQuery',
            templateUrl: Route.base('pages/zyQuery.html')
        })
        .state('app.zyEdit', {
            url: '/zyEdit/:batchCode/:canEdit',
            templateUrl: Route.base('pages/zyEdit.html')
        })
        .state('login', {
            url: '/login',
            templateUrl: Route.base('pages/login.html')
        })


        .state('app.notices', {
            url: '/notices',
            templateUrl: Route.base('pages/notices.html')
        });

  }

})();


/**=========================================================
 * Module: RouteProvider.js
 * Provides helper functions for routes definition
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .provider('Route', RouteProvider)
        ;
    
    RouteProvider.$inject = ['VENDOR_ASSETS'];
    function RouteProvider (VENDOR_ASSETS) {

      // Set here the base of the relative path
      // for all app views
      this.base = function (uri) {
        return 'app/views/' + uri;
      };

      // Generates a resolve object by passing script names
      // previously configured in constant.VENDOR_ASSETS
      this.require = function () {
        var _args = arguments;
        return ['$ocLazyLoad','$q', function ($ocLL, $q) {
            // Creates a promise chain for each argument
            var promise = $q.when(1); // empty promise
            for(var i=0, len=_args.length; i < len; i ++){
              promise = andThen(_args[i]);
            }
            return promise;

            // creates promise to chain dynamically
            function andThen(_arg) {
              // also support a function that returns a promise
              if(typeof _arg === 'function')
                  return promise.then(_arg);
              else
                  return promise.then(function() {
                    // if is a module, pass the name. If not, pass the array
                    var whatToLoad = getRequired(_arg);
                    // simple error check
                    if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                    // finally, return a promise
                    return $ocLL.load( whatToLoad );
                  });
            }
            // check and returns required data
            // analyze module items with the form [name: '', files: []]
            // and also simple array of script files (for non angular scripts)
            function getRequired(name) {
              if (VENDOR_ASSETS.modules)
                  for(var m in VENDOR_ASSETS.modules)
                      if(VENDOR_ASSETS.modules[m].name && VENDOR_ASSETS.modules[m].name === name)
                          return VENDOR_ASSETS.modules[m];
              return VENDOR_ASSETS.scripts && VENDOR_ASSETS.scripts[name];
            }

          }];
      }; // require

      // not necessary, only used in config block for routes
      this.$get = function(){};

    }

})();

/**=========================================================
 * Module: RoutesRun
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .run(appRun);
    /* @ngInject */
    function appRun($rootScope, $window) {

        // Hook not found
        $rootScope.$on('$stateNotFound',
            function(event, unfoundState, fromState, fromParams) {
                console.log(unfoundState.to); // "lazy.state"
                console.log(unfoundState.toParams); // {a:1, b:2}
                console.log(unfoundState.options); // {inherit:false} + default options
            });

        //hook start
        //show mask layer
        $rootScope.$on('$stateChangeStart',
            function() {
                $rootScope.showMask = true;
            });

        // Hook success
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams) {
                // success here
                // display new view from top
                $window.scrollTo(0, 0);
                $rootScope.showMask = false;
            });

    }
    appRun.$inject = ['$rootScope', '$window'];

})();


/**=========================================================
 * Module: VendorAssetsConstant.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .constant('VENDOR_ASSETS', {
            // jQuery based and standalone scripts
            scripts: {
            },
            // Angular modules scripts (name is module name to be injected)
            modules: [
            ]

        });

})();


/**=========================================================
 * Module: SettingsController.js
 * Handles app setting
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('SettingsController', SettingsController);
    /* @ngInject */
    function SettingsController(settings) {
      var vm = this;
      // Restore/Save layout settings
      settings.loadAndWatch();

      // Set scope for panel settings
      vm.themes = settings.availableThemes();
      vm.setTheme = settings.setTheme;

    }
    SettingsController.$inject = ['settings'];
})();

/**=========================================================
 * Module: SettingsService
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .service('settings', settings);
    /* @ngInject */
    function settings($rootScope, $localStorage) {
      /*jshint validthis:true*/
      var self = this;

      self.init = init;
      self.loadAndWatch = loadAndWatch;
      self.availableThemes = availableThemes;
      self.setTheme = setTheme;

      /////////////////

      self.themes = [
        {name: 'primary',   sidebar: 'bg-white',   sidebarHeader: 'bg-primary bg-light',   brand: 'bg-primary',   topbar:  'bg-primary'},
        {name: 'purple',    sidebar: 'bg-white',   sidebarHeader: 'bg-purple bg-light',    brand: 'bg-purple',    topbar:  'bg-purple'},
        {name: 'success',   sidebar: 'bg-white',   sidebarHeader: 'bg-success bg-light',   brand: 'bg-success',   topbar:  'bg-success'},
        {name: 'warning',   sidebar: 'bg-white',   sidebarHeader: 'bg-warning bg-light',   brand: 'bg-warning',   topbar:  'bg-warning'},
        {name: 'info',      sidebar: 'bg-white',   sidebarHeader: 'bg-info bg-light',      brand: 'bg-info',      topbar:  'bg-info'},
        {name: 'danger',    sidebar: 'bg-white',   sidebarHeader: 'bg-danger bg-light',    brand: 'bg-danger',    topbar:  'bg-danger'},
        {name: 'pink',      sidebar: 'bg-white',   sidebarHeader: 'bg-pink bg-light',      brand: 'bg-pink',      topbar:  'bg-pink'},
        {name: 'amber',     sidebar: 'bg-white',   sidebarHeader: 'bg-amber bg-light',     brand: 'bg-amber',     topbar:  'bg-amber'},
      ];

      function init() {
        // Global settings
        $rootScope.app = {
          name:          '志愿填报系统',
          description:   '黑龙江省招生考试院--高考网上志愿填报系统',
          titleText:   '黑龙江省高考网上志愿填报系统',
          year:          new Date().getFullYear(),
          views: {
            animation: 'ng-fadeInLeft2'
          },
          layout: {
            isFixed: false,
            isBoxed: false,
            isDocked: false
          },
          sidebar: {
            isOffscreen: true,
            isMini: false,
            isRight: false
          },
          footer: {
            hidden: false
          },
          themeId: 0,
          // default theme
          theme: {//默认主题色，深灰色
            name:          'gray-darker',
            sidebar:       'bg-white',
            sidebarHeader: 'bg-danger bg-light',
            brand:         'bg-danger',
            topbar:        'bg-danger'
          }
        };      
      }

      function loadAndWatch() {
        // Load current settings from local storage
        /*
        if( angular.isDefined($localStorage.settings) )
          $rootScope.app = $localStorage.settings;
        else*/

        $localStorage.settings = $rootScope.app;

        //监视布局变动，不需要
        /*
        $rootScope.$watch('app.layout', function () {
          $localStorage.settings = $rootScope.app;
        }, true);*/
      }

      function availableThemes() {
        return self.themes;
      }

      function setTheme(idx) {
        $rootScope.app.theme = this.themes[idx];
      }

    }
    settings.$inject = ['$rootScope', '$localStorage'];

})();

/**=========================================================
 * Module: BrowserDetectionService.js
 * Browser detection service
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .service('browser', service);

    function service() {
      /*jshint validthis:true*/
      var matched, browser = this;

      var uaMatch = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(opr)[\/]([\w.]+)/.exec( ua ) ||
          /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
          /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
          /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
          /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
          /(msie) ([\w.]+)/.exec( ua ) ||
          ua.indexOf('trident') >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
          ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
          [];

        var platform_match = /(ipad)/.exec( ua ) ||
          /(iphone)/.exec( ua ) ||
          /(android)/.exec( ua ) ||
          /(windows phone)/.exec( ua ) ||
          /(win)/.exec( ua ) ||
          /(mac)/.exec( ua ) ||
          /(linux)/.exec( ua ) ||
          /(cros)/i.exec( ua ) ||
          [];

        return {
          browser: match[ 3 ] || match[ 1 ] || '',
          version: match[ 2 ] || '0',
          platform: platform_match[ 0 ] || ''
        };
      };

      matched = uaMatch( window.navigator.userAgent );

      if ( matched.browser ) {
        browser[ matched.browser ] = true;
        browser.version = matched.version;
        browser.versionNumber = parseInt(matched.version);
      }

      if ( matched.platform ) {
        browser[ matched.platform ] = true;
      }

      // These are all considered mobile platforms, meaning they run a mobile browser
      if ( browser.android || browser.ipad || browser.iphone || browser[ 'windows phone' ] ) {
        browser.mobile = true;
      }

      // These are all considered desktop platforms, meaning they run a desktop browser
      if ( browser.cros || browser.mac || browser.linux || browser.win ) {
        browser.desktop = true;
      }

      // Chrome, Opera 15+ and Safari are webkit based browsers
      if ( browser.chrome || browser.opr || browser.safari ) {
        browser.webkit = true;
      }

      // IE11 has a new token so we will assign it msie to avoid breaking changes
      if ( browser.rv )
      {
        var ie = 'msie';

        matched.browser = ie;
        browser[ie] = true;
      }

      // Opera 15+ are identified as opr
      if ( browser.opr )
      {
        var opera = 'opera';

        matched.browser = opera;
        browser[opera] = true;
      }

      // Stock Android browsers are marked as Safari on Android.
      if ( browser.safari && browser.android )
      {
        var android = 'android';

        matched.browser = android;
        browser[android] = true;
      }

      // Assign the name and platform variable
      browser.name = matched.browser;
      browser.platform = matched.platform;


      return browser;
    }

})();

/**=========================================================
 * Module: SupportService.js
 * Checks for features supports on browser
 =========================================================*/
/*jshint -W069*/
(function() {
    'use strict';

    angular
        .module('naut')
        .service('support', service);
    
    service.$inject = ['$document', '$window'];
    function service($document, $window) {
      /*jshint validthis:true*/
      var support = this;
      var doc = $document[0];

      // Check for transition support
      // ----------------------------------- 
      support.transition = (function() {

        function transitionEnd() {
            var el = document.createElement('bootstrap');

            var transEndEventNames = {
              WebkitTransition : 'webkitTransitionEnd',
              MozTransition    : 'transitionend',
              OTransition      : 'oTransitionEnd otransitionend',
              transition       : 'transitionend'
            };

            for (var name in transEndEventNames) {
              if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] };
              }
            }
            return false;
          }

          return transitionEnd();
      })();

      // Check for animation support
      // ----------------------------------- 
      support.animation = (function() {

          var animationEnd = (function() {

              var element = doc.body || doc.documentElement,
                  animEndEventNames = {
                      WebkitAnimation: 'webkitAnimationEnd',
                      MozAnimation: 'animationend',
                      OAnimation: 'oAnimationEnd oanimationend',
                      animation: 'animationend'
                  }, name;

              for (name in animEndEventNames) {
                  if (element.style[name] !== undefined) return animEndEventNames[name];
              }
          }());

          return animationEnd && { end: animationEnd };
      })();

      // Check touch device
      // ----------------------------------- 
      support.touch                 = (
          ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
          ($window.DocumentTouch && document instanceof $window.DocumentTouch)  ||
          ($window.navigator['msPointerEnabled'] && $window.navigator['msMaxTouchPoints'] > 0) || //IE 10
          ($window.navigator['pointerEnabled'] && $window.navigator['maxTouchPoints'] > 0) || //IE >=11
          false
      );

      return support;

    }
})();

/**=========================================================
 * Module: TouchDragService.js
 * Services to add touch drag to a dom element
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .service('touchDrag', touchDrag);

    touchDrag.$inject = ['$document', 'browser'];
    function touchDrag($document, browser) {
      /*jshint validthis:true*/
      var self = this;

      self.touchHandler = function (event) {
          var touch = event.changedTouches[0];

          var simulatedEvent = document.createEvent('MouseEvent');
              simulatedEvent.initMouseEvent({
              touchstart: 'mousedown',
              touchmove: 'mousemove',
              touchend: 'mouseup'
          }[event.type], true, true, window, 1,
              touch.screenX, touch.screenY,
              touch.clientX, touch.clientY, false,
              false, false, false, 0, null);

          touch.target.dispatchEvent(simulatedEvent);
          event.preventDefault();
      };

      self.addTo = function (element) {
        element = element || $document;
        if(browser.mobile) {
          element.addEventListener('touchstart', this.touchHandler, true);
          element.addEventListener('touchmove', this.touchHandler, true);
          element.addEventListener('touchend', this.touchHandler, true);
          element.addEventListener('touchcancel', this.touchHandler, true);
        }
      };
    }

})();
