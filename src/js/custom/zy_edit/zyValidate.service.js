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
        }

        var _getMsg = function(m) {
            return _msg[m];
        }

        var _validateOneWish = function(wish) {
            var arr = [];
            var college = wish[1];
            var majors = wish[2];
            var obey = wish[3];
            arr.push[_getMsg()];

            if (!(majors && majors.length >= 1)) {
                return arr.push[3];
            }
            if (!obey) {
                return 4;
            }
            return 0;
        }

        var _validateAllWishes = function(wishes) {
            if (!(wishes && wishes.length >= 1)) {
                return 5;
            }
            for (var w in wishes) {
                var re = _validateOneWish(wishes[w]);
                if (!re) return re;
            }
            return 0;
        }

    }
})();