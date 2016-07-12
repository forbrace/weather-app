(function (angular) {
    angular
        .module('app')
        .component('appWeather', {
            templateUrl: 'assets/js/components/weather.html',
            bindings: {
                cities: '<'
            },
            controller: WeatherController
        });


    function WeatherController() {
        var vm = this;

        vm.debug = false;
        vm.convertUnixDate = convertUnixDate;
        vm.formatSpeed = formatSpeed;

        function convertUnixDate(unixDate) {
            return new Date(unixDate * 1000);
        }

        function formatSpeed(ms) {
            return Math.round((ms * 1000 / 3600) * 100) / 100;
        }
    }

})(angular);
