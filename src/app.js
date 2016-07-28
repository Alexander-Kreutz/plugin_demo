var demo = angular.module('demo', [ 'midata', 'pascalprecht.translate', 'demoi18n' ]);
// Configuration
demo.config(['$translateProvider', 'i18nc', function($translateProvider, i18nc) {	    
    
	$translateProvider
	.useSanitizeValueStrategy('escape')	   	    
	.registerAvailableLanguageKeys(['en', 'de', 'it', 'fr'], {
	  'en_*': 'en',
	  'de_*': 'de',
	  'fr_*': 'fr',
	  'it_*': 'it',
	})
	.translations('en', i18nc.en)
	.translations('de', i18nc.de)
	.translations('it', i18nc.it)
	.translations('fr', i18nc.fr)
	.fallbackLanguage('en');
	
	console.log("done1");
}]);
// The data importer
demo.factory('importer', ['$http' , '$translate', 'midataServer', '$q', function($http, $translate, midataServer, $q) {
	
	var importer = {};
		
	// This is triggered from server
	importer.automatic = function(authToken, lang) {
		
		// set language to be used
		$translate.use(lang);
					
		// Trigger the import
		return importer.importNow(authToken);				
	};
	
	// Trigger the import. Must be runnable from webbrowser or from server
	importer.importNow = function(authToken) {
		
		// Lets just create a body weight record on MIDATA
		// meta information for MIDATA API 
		var midataHeader = {
		  name : "Test Record",
		  format : "fhir/Observation",
		  subformat : "Quantity",
		  code : "http://loinc.org 3141-9",		  
		};
		// FHIR record content
		var recordContent = {
		  resourceType : "Observation",
		  status: "preliminary",
		  category: { 
			  coding: [ { system: "http://hl7.org/fhir/observation-category", code: "vital-signs", display: "Vital Signs" } ]
		  }, 
		  code: { 
			  coding: [ { system: "http://loinc.org", code: "3141-9", display: "Body - Weight" } ]
		  }, 
		  effectiveDateTime: "2016-05-01", 
		  valueQuantity: { 
			  value: 81.0, 
			  unit: "kg" 
		  }	
		};
		
		// create the record on the server
		var mypromise = midataServer.createRecord(authToken, midataHeader, recordContent);
		
		// return promise that resolves when done
		return mypromise;
	
	};
			
	return importer;	
}]);
// The frontend controller
demo.controller('MyController', ['$scope', '$translate', '$location', 'midataServer', 'midataPortal', 'importer',  
	function($scope, $translate, $location, midataServer, midataPortal, importer) {
		
	    // Make layout fit into MIDATA page
	    midataPortal.autoresize();
	    
	    // Use language from MIDATA portal
	    $translate.use(midataPortal.language);
	    console.log(midataPortal.language);
	            				
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
