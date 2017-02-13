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