var app = angular.module('cdc', ['ngResource']);

app.controller('formCtrl', function($scope, $http, myResource){

    $scope.salva = function($scope){

        // $scope.here();

        const stringman = {
            'nome' : $scope.str_user_firstname,
            'sobrenome' : $scope.str_user_lastname,
            'cpf' : $scope.str_user_cpf,
            'login' : $scope.str_user_login,
            'senha' : $scope.str_user_pass,
            'cep' : $scope.str_user_postcode,
            'endereco' : $scope.str_user_address,
            'numero' : $scope.str_user_address_number,
            'bairro' : $scope.str_user_address_neighbornhood,
            'latitude':  $scope.str_user_latitude,
            'longitude': $scope.str_user_longitude,
        };
        console.log(stringman);

        doAjax(stringman);

        async function doAjax(args) {
            let result;
            try {
                result = await $.ajax({
                    url: 'http://localhost/clubstring/send.php',
                    type: 'POST',
                    data: args
                });
                return result;
            } catch (error) {
                console.error(error);
            }
        }

    }



    $scope.here = function(){

        $scope.$watchCollection('[str_user_address,str_user_address_number,str_user_postcode]', function(data) {
           $scope.message =
            {
              first: data[0],
              second: data[1],
              third: data[2]
            };

            console.log($scope.message);

            const msg = $scope.message.first +'%27'+$scope.message.second +'%27'+$scope.message.third;

            if(msg != 'undefined%27undefined'){
                getAddress(msg);
            }else{
                console.log('fields null');
            }

        });

    }


    $scope.findCep = function () {
        if($scope.str_user_postcode.length == '8') {
            myResource.get({
                'cep': $scope.str_user_postcode
            }).$promise
                .then(function success(result) {
                    // $scope.city = result.localidade;
                    // $scope.estado = result.uf
                    // $scope.local = $scope.city + ' - ' + $scope.estado;
                    // if($scope.local == 'undefined - undefined'){
                    //     $scope.local = 'Cep Inexistente';
                    // }
                    $scope.str_user_address = result.logradouro;
                    $scope.str_user_address_neighbornhood = result.bairro;
                    console.log(result);
                }).catch(function error(msg) {
                console.error('Error');
            });
        }
    }

    async function getAddress(address) {
      const response = await fetch(`https://maps.google.com/maps/api/geocode/json?key=AIzaSyCtxBcxkqT6hJPJwFYL9ceNPQQ2rXHzdCA&address=${address}&sensor=true`);
      const person = await response.json();
      console.log(person);
      const location = person.results[0].geometry.location;
      $scope.str_user_latitude = location.lat;
      $scope.str_user_longitude = location.lng;
    }


});


app.factory('myResource', function ($resource) {
    var rest = $resource(
        'https://viacep.com.br/ws/:cep/json/',
        {
            'cep': ''
        }
    );
    return rest;
});
