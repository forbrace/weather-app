(function (angular) {
    'use strict';

    angular
        .module('app.services.weather', [])
        .constant('API_KEY', 'c718df2ccdeebaf67da588af6b18568d')
        .factory('weatherService', weatherService)
    ;

    weatherService.$inject = ['API_KEY', '$http'];

    function weatherService(API_KEY, $http) {

        var weather = {
            getCurrentData: getCurrentData
        };

        return weather;

        function getCurrentData(city) {
            return $http.get('//api.openweathermap.org/data/2.5/weather?q='+city+'&APPID='+API_KEY+'&units=metric');
        }

    }

})(angular);