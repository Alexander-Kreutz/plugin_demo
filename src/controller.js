// The frontend controller
demo.controller('MyController', ['$scope', '$translate', '$location', 'midataServer', 'midataPortal', 'importer',  
	function($scope, $translate, $location, midataServer, midataPortal, importer) {
		
	    // Make layout fit into MIDATA page
	    midataPortal.autoresize();
	    
	    // Use language from MIDATA portal
	    $translate.use(midataPortal.language);	 
	            				
		// get authorization token from portal
		var authToken = $location.search().authToken;
		
		// Just for demonstration		
		$scope.worldVar = "hello_world";
		
		// button to start import
		$scope.startImport = function() {
			importer.importNow(authToken)
			.then(function() { $scope.status = "ok"; })
			.catch(function() { $scope.status = "error"; });
		};
									
	}
]);
