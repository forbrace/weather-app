(function (angular) {
    angular
        .module('app')
        .component('appSearch', {
            templateUrl: 'assets/js/components/search.html',
            bindings: {
                cities: '=ngModel'
            },
            controller: SearchController
        });

    SearchController.$inject = ['weatherService'];

    function SearchController(weatherService) {
        var vm = this;

        vm.loading = false;
        vm.cities = [];
        vm.search = search;

        function search() {
            vm.loading = true;

            vm.cities.forEach(function (city, i, cities) {
                weatherService
                    .getCurrentData(city.text)
                    .then(
                        function (response) {
                            city.data = response.data;
                            vm.loading = false;
                        }, function (response) {
                            vm.errorMessage = 'Error: ' + response.status + ' ' + response.statusText;
                            vm.loading = false;
                        });
            });
        }
    }

})(angular);
