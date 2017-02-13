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