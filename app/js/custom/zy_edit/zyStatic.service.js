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