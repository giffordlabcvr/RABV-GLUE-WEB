	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https:www.google-analytics.com/analytics.js','ga');
	
	  console.log("document.location.hostname", document.location.hostname);
	  var trackingID;
	  if(document.location.hostname.indexOf("rabv.glue.cvr.ac.uk") >= 0) {
		  // RABV-GLUE production analytics account
		  trackingID = 'UA-93776838-1';
		  ga('create', trackingID, 'auto');
	  } else {
		  // sandbox analytics account
		  trackingID = 'UA-93752139-1';
		  ga('create', trackingID, 'none');
	  }

var rabvApp = angular.module('rabvApp', [
    'ngRoute',
    'analysisTool', 
    'projectBrowser', 
    'home',
    'glueWS',
    'glueWebToolConfig',
    'treeControl',
    'angulartics',
    'angulartics.google.analytics',
    'angular-cookie-law'
  ]);

console.log("after rabvApp module definition");

rabvApp.config(['$routeProvider', 'projectBrowserStandardRoutesProvider',
  function($routeProvider, projectBrowserStandardRoutesProvider) {
	
	var projectBrowserStandardRoutes = projectBrowserStandardRoutesProvider.$get();
	var projectBrowserURL = "../gluetools-web/www/projectBrowser";
	// custom single alignment view
	$routeProvider.
    when('/project/reference/:referenceName', {
	  templateUrl: 'views/rabvReference.html',
	  controller: 'rabvReferenceCtrl'
    });
    // custom alignments view
	$routeProvider.
    when('/project/alignment', {
  	  templateUrl: 'views/rabvAlignments.html',
  	  controller: 'rabvAlignmentsCtrl'
      });
	// custom single alignment view
	$routeProvider.
    when('/project/alignment/:alignmentName', {
	  templateUrl: 'views/rabvAlignment.html',
	  controller: 'rabvAlignmentCtrl'
    });
    // custom sequences view
	$routeProvider.
    when('/project/sequence', {
  	  templateUrl: 'views/rabvSequences.html',
  	  controller: 'rabvSequencesCtrl'
      });
	// custom single sequence view
	$routeProvider.
    when('/project/sequence/:sourceName/:sequenceID', {
	  templateUrl: 'views/rabvSequence.html',
	  controller: 'rabvSequenceCtrl'
    });

	
    $routeProvider.
    when('/analysisTool', {
      templateUrl: '../gluetools-web/www/analysisTool/analysisTool.html',
      controller: 'analysisToolCtrl'
    });
	
    $routeProvider.
    when('/home', {
  	  templateUrl: './modules/home/home.html',
  	  controller: 'homeCtrl'
    }).
    otherwise({
  	  redirectTo: '/home'
    });

    $routeProvider.
    when('/howToCite', {
  	  templateUrl: './modules/home/howToCite.html',
  	  controller: 'howToCiteCtrl'
    }).
    otherwise({
  	  redirectTo: '/home'
    });

    $routeProvider.
    when('/team', {
  	  templateUrl: './modules/home/team.html',
  	  controller: 'teamCtrl'
    }).
    otherwise({
  	  redirectTo: '/home'
    });
}]);

rabvApp.controller('rabvAppCtrl', 
  [ '$scope', 'glueWS', 'glueWebToolConfig',
function ($scope, glueWS, glueWebToolConfig) {
	$scope.brand = "RABV-GLUE";
	$scope.homeMenuTitle = "Home";
	$scope.projectBrowserMenuTitle = "Sequence Data";
	$scope.projectBrowserAlignmentMenuTitle = "NCBI Sequences by Clade";
	$scope.projectBrowserSequenceMenuTitle = "All NCBI Sequences";
	$scope.analysisMenuTitle = "Analysis";
	$scope.analysisToolMenuTitle = "Genotyping and Interpretation";
	$scope.aboutMenuTitle = "About";
	$scope.howToCiteMenuTitle = "How to cite";
	$scope.teamMenuTitle = "Team";
	glueWS.setProjectURL("../../../gluetools-ws/project/rabv");
	glueWebToolConfig.setAnalysisToolURL("../gluetools-web/www/analysisTool");
	glueWebToolConfig.setAnalysisToolExampleSequenceURL("exampleSequences/fullGenome1.fasta");
	glueWebToolConfig.setAnalysisToolExampleMsWindowsSequenceURL("exampleSequencesMsWindows/fullGenome1.fasta");
	glueWebToolConfig.setAnalysisModuleName("rabvWebAnalysisTool");
	glueWebToolConfig.setProjectBrowserURL("../gluetools-web/www/projectBrowser");
	glueWebToolConfig.setGlueWSURL("../gluetools-web/www/glueWS");
} ]);


