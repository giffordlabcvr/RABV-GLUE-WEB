projectBrowser.controller('rabvSequencesCtrl', 
		[ '$scope', 'glueWebToolConfig', 'glueWS', '$controller', 'dialogs', 
		    function($scope, glueWebToolConfig, glueWS, $controller, dialogs) {

			$controller('sequencesCtrl', { $scope: $scope, 
				glueWebToolConfig: glueWebToolConfig, 
				glueWS: glueWS, 
				dialogs: dialogs});

			console.log("initializing rabv sequences");

			$scope.init("source.name = 'ncbi-curated'", 
					["source.name",
                     "sequenceID",
                     "gb_country",
                     "collection_year",
                     "gb_length",
                     "gb_create_date",
                     "gb_update_date",
                     "isolate",
                     "host"] );
			
			
			$scope.pagingContext.setDefaultSortOrder([
  			    { property: "sequenceID", displayName: "NCBI Nucleotide ID", order: "+" }
  			]);

  			
  			$scope.pagingContext.setSortableProperties([
  	            { property:"sequenceID", displayName: "NCBI Nucleotide ID" },
  	            { property:"gb_create_date", displayName: "NCBI Entry Creation Date" },
  	            { property:"gb_update_date", displayName: "NCBI Last Update Date" },
  	            { property:"gb_country", displayName: "Country of Origin" },
  	            { property:"collection_year", displayName: "Collection Year" },
  	            { property:"isolate", displayName: "Isolate ID" },
  	            { property:"host", displayName: "Host Species" },
  	            { property:"gb_length", displayName: "Sequence Length" }
              ]);

			$scope.pagingContext.setFilterProperties([
         		{ property:"sequenceID", displayName: "NCBI Nucleotide ID", filterHints: {type: "String"} },
        		{ property:"gb_length", displayName: "Sequence Length", filterHints: {type: "Integer"} },
        		{ property:"gb_create_date", displayName: "NCBI Entry Creation Date", filterHints: {type: "Date"} },
        		{ property:"gb_update_date", displayName: "NCBI Last Update Date", filterHints: {type: "Date"} },
  	            { property:"gb_country", displayName: "Country of Origin", filterHints: {type: "String"} },
	            { property:"host", displayName: "Host Species", filterHints: {type: "String"} },
	            { property:"collection_year", displayName: "Latest Collection Year", filterHints: {type: "Integer"} },
	            { property:"isolate", displayName: "Isolate ID", filterHints: {type: "String"} }
			]);

  			$scope.pagingContext.setDefaultFilterElems([]);
			
			
}]);