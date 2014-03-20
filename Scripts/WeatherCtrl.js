angular.module('myApp', ['ui.bootstrap','LocalStorageModule']);
function WeatherCtrl($scope, $http,localStorageService) {
	$scope.addresses = [];
  $scope.selected = undefined;
  $scope.submitClick = false;
  $scope.actualSymbol = "℉";
  $scope.wantedSymbol = "℃";

  $scope.umbrella = false;
  
  $scope.umbrellaList = [200,201,202,230,231,232,500,501,502,503,504,511,520,521,522];
  
  $scope.init = function()
  {
	  
	  $scope.searchTxt = localStorageService.get('lastModel');
	  
	  if($scope.searchTxt != null)
		  $scope.getWeather();
  
  };
  $scope.getLocation = function(val) {
	  
	  
    return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        sensor: false
      }
    }).then(function(res){
      var addresses = [];
      angular.forEach(res.data.results, function(item){
        addresses.push({address:item.formatted_address,
        				location:item.geometry
        				});
        
      });
      console.log(addresses);
      return addresses;
    });
  };
  
  $scope.getWeather = function(){
	  localStorageService.set('lastModel',$scope.searchTxt);
	console.log($scope.searchTxt.location.location); 
	
	var geometry = $scope.searchTxt.location.location;
	$scope.submitClick = true;
	
	if($scope.actualSymbol === "℉")
		units = 'imperial';
	else
		units = 'metric';
	
	$http({
		  method: 'GET', 
		  url: 'http://api.openweathermap.org/data/2.5/forecast/daily', 
		  params:{lat:geometry.lat,lon:geometry.lng,cnt:'1',units:units}
		}).
	    success(function(data, status) {
	    	
	    	console.log(data.list);
	    	var temp = data.list[0].temp;
	    	var weather = data.list[0].weather;
	    	
	    	$scope.maxTemp = temp.max;
	    	$scope.minTemp = temp.min;
	        $scope.weather = weather[0].description.toUpperCase();
	        console.log(weather[0].id);
	        $scope.umbrella = true;
	        if($scope.umbrellaList.indexOf(weather[0].id) > -1)
	        	{
   		
	        		$scope.result = "Please take your umbrella buddy!!";
	        		
	        	}
	        else
	        	$scope.result = "Yay!! You don't need an umbrella today!!";
	        
	        $scope.imgUrl  = "http://openweathermap.org/img/w/"+weather[0].icon+".png";
	    }).
	    error(function(data, status) {
	      $scope.data = data || "Request failed";
	      $scope.status = status;
	  });
  };
  
  $scope.convertTemp = function()
  {
	  
	 if($scope.actualSymbol === "℉")  
	 {
		 $scope.maxTemp = ($scope.maxTemp-32) * 5 / 9;
		 $scope.minTemp = ($scope.minTemp-32) * 5 / 9;
		 $scope.actualSymbol = "℃";
		 $scope.wantedSymbol = "℉";
	 }
	 
	 else
	 {
		 
		 $scope.maxTemp = $scope.maxTemp * 9 / 5 + 32;
		 $scope.minTemp = $scope.minTemp * 9 / 5 + 32;
		 $scope.actualSymbol = "℉";
		 $scope.wantedSymbol = "℃";
	 }
	  
	 $scope.maxTemp = Math.round($scope.maxTemp * 100)/100;
	 $scope.minTemp = Math.round($scope.minTemp * 100)/100;
  };

}