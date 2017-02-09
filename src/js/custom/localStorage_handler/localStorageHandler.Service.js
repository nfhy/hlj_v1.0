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
            })
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
                return key;
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
        }

    }
})();