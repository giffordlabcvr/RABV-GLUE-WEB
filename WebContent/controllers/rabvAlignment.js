rabvApp.controller('rabvAlignmentCtrl', 
		[ '$scope', '$routeParams', '$controller', 'glueWS', 'glueWebToolConfig', 'dialogs',
		  function($scope, $routeParams, $controller, glueWS, glueWebToolConfig, dialogs) {
			addUtilsToScope($scope);

			$controller('alignmentCtrl', { $scope: $scope, 
				glueWebToolConfig: glueWebToolConfig, 
				glueWS: glueWS, 
				dialogs: dialogs});

			$scope.init($routeParams.alignmentName, 
					"rabvAlignmentRenderer", "sequence.source.name = 'ncbi-curated' and referenceMember = false",
					[
					 "sequence.sequenceID",
                     "alignment.name",
                     "alignment.displayName",
                     "sequence.gb_country",
					 "sequence.collection_year",
					 "sequence.gb_length",
					 "sequence.gb_create_date",
                     "sequence.gb_update_date",
					 "sequence.host",
					 "sequence.isolate"
					 ]);

			$scope.pagingContext.setDefaultSortOrder([
			    { property: "sequence.sequenceID", displayName: "NCBI Nucleotide ID", order: "+" }
			]);
	
			$scope.pagingContext.setSortableProperties([
	            { property:"sequence.sequenceID", displayName: "NCBI Nucleotide ID" },
	            { property:"sequence.gb_create_date", displayName: "NCBI Entry Creation Date" },
	            { property:"sequence.gb_update_date", displayName: "NCBI Last Update Date" },
                { property:"alignment.name", displayName: "Genotype / Subtype" },
  	            { property:"sequence.gb_country", displayName: "Country of Origin" },
  	            { property:"sequence.collection_year", displayName: "Earliest Collection Year" },
	            { property:"sequence.isolate", displayName: "Isolate ID" },
	            { property:"sequence.host", displayName: "Host Species" },
	            { property:"sequence.gb_length", displayName: "Sequence Length" }
	        ]);

			$scope.pagingContext.setFilterProperties([
           		{ property:"sequence.sequenceID", displayName: "NCBI Nucleotide ID", filterHints: {type: "String"} },
          		{ property:"sequence.gb_length", displayName: "Sequence Length", filterHints: {type: "Integer"} },
                { property:"alignment.displayName", displayName: "Genotype / Subtype", filterHints: {type: "String"}  },
          		{ property:"sequence.gb_create_date", displayName: "NCBI Entry Creation Date", filterHints: {type: "Date"} },
          		{ property:"sequence.gb_update_date", displayName: "NCBI Last Update Date", filterHints: {type: "Date"} },
  	            { property:"sequence.gb_country", displayName: "Country of Origin", filterHints: {type: "String"} },
  	            { property:"sequence.host", displayName: "Host Species", filterHints: {type: "String"} },
	            { property:"sequence.collection_year", displayName: "Latest Collection Year", filterHints: {type: "Integer"} },
  	            { property:"sequence.isolate", displayName: "Isolate ID", filterHints: {type: "String"} },
  			]);

			$scope.pagingContext.setDefaultFilterElems([]);

			
		}]);