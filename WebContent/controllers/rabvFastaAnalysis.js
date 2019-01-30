rabvApp.controller('rabvFastaAnalysisCtrl', 
		[ '$scope', '$controller', 'glueWS', 'glueWebToolConfig', 'dialogs', '$analytics', 'saveFile', 'FileSaver', '$http', '$window', '$timeout',
		  function($scope, $controller, glueWS, glueWebToolConfig, dialogs, $analytics, saveFile, FileSaver, $http, $window, $timeout) {
			
			addUtilsToScope($scope);

			$scope.analytics = $analytics;
			$scope.featureVisualisationUpdating = false;
			$scope.phyloVisualisationUpdating = false;
			$scope.phyloLegendUpdating = false;
			$scope.featureSvgUrlCache = {};
			$scope.phyloSvgResultObjectCache = {};
			$scope.featureNameToScrollLeft = {};
			$scope.lastFeatureName = null;
	    	$scope.displaySection = 'summary';
			
	    	$scope.neighbourSlider = {
	    			  value: 25,
	    			  options: {
	    			    precision: 3,
	    			    floor: 0,
	    			    ceil: 500,
	    			    hideLimitLabels: true,
	    			    hidePointerLabels: true,
	    			    getLegend: function(value, sliderId) { return toFixed(value/1000, 2); }, 
	    			    step: 1,
	    			    showTicks: 50,
	    			    keyboardSupport: false,
	    			  }
	    			};
	    	
			$controller('fileConsumerCtrl', { $scope: $scope, 
				glueWebToolConfig: glueWebToolConfig, 
				glueWS: glueWS, 
				dialogs: dialogs});

			// executed after the project URL is set
			glueWS.addProjectUrlListener( {
				reportProjectURL: function(projectURL) {
				    $scope.uploader.url = projectURL + "/module/rabvReportingController";
				    console.info('uploader.url', $scope.uploader.url);
				}
			});
			
			
		    // CALLBACKS
		    $scope.uploader.onBeforeUploadItem = function(item) {
				var commandObject = {
						"invoke-consumes-binary-function" : {
							"functionName": "reportFastaWeb",
							"argument": [item.file.name]
						}
				};
		    	item.formData = [{command: JSON.stringify(commandObject)}];
		        console.info('formData', JSON.stringify(item.formData));
		        console.info('onBeforeUploadItem', item);
				$scope.analytics.eventTrack("submitFastaFile", 
						{   category: 'rabvFastaAnalysis', 
							label: 'fileName:'+item.file.name+',fileSize:'+item.file.size});


		    };
		    $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
		        console.info('onSuccessItem', fileItem, response, status, headers);
				$scope.analytics.eventTrack("rabvFastaAnalysisResult", 
						{  category: 'rabvFastaAnalysis', 
							label: 'fileName:'+fileItem.file.name+',fileSize:'+fileItem.file.size });
				fileItem.response = response;
				console.log("rabvFastaAnalysis.response", response);
		    };
		    $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
		        console.info('onErrorItem', fileItem, response, status, headers);
		        var errorFn = glueWS.raiseErrorDialog(dialogs, "processing sequence file \""+fileItem.file.name+"\"");
		        errorFn(response, status, headers, {});
		    };

			$scope.removeAll = function() {
				$scope.uploader.clearQueue();
				$scope.fileItemUnderAnalysis = null;
			}

			$scope.removeItem = function(item) {
				if($scope.fileItemUnderAnalysis == item) {
					$scope.fileItemUnderAnalysis = null;
				}
				item.remove();
			}
		    
		    $scope.showAnalysisResults = function(item) {
		    	$scope.setFileItemUnderAnalysis(item);
		    };
			
		    $scope.setFileItemUnderAnalysis = function(item) {
				$scope.saveFeatureScrollLeft();
		    	if(item.sequenceReport == null) {
		    		$scope.setSequenceReport(item, item.response.rabvWebReport.results[0]);
		    	}
		    	$scope.fileItemUnderAnalysis = item;
		    	$scope.featureVisualisationSvgUrl = null;
		    	$scope.phyloVisualisationSvgResultObject = null;
		    	$scope.phyloVisualisationSvgUrl = null;
		    	$scope.phyloLegendSvgUrl = null;
		    }
		    
		    $scope.setSequenceReport = function(item, sequenceReport) {
		    	// e.g. null genotype
		    	if(sequenceReport.rabvReport.sequenceResult.visualisationHints == null) {
		    		$scope.setComparisonRef(sequenceReport, null);
		    		$scope.setFeature(sequenceReport, null);
		    	} else {
			    	if(sequenceReport.rabvReport.comparisonRef == null) {
			    		$scope.setComparisonRef(sequenceReport, sequenceReport.rabvReport.sequenceResult.visualisationHints.comparisonRefs[0]);
			    	}
		    		var availableFeatures = sequenceReport.rabvReport.sequenceResult.visualisationHints.features;
		    		var feature = sequenceReport.rabvReport.feature;
			    	if(feature == null) {
			    		feature = availableFeatures[0];
			    	}
		    		if($scope.lastFeatureName != null) {
		    			var equivalentFeature = _.find(availableFeatures, function(availableFeature) { return availableFeature.name == $scope.lastFeatureName; });
		    			if(equivalentFeature != null) {
		    				feature = equivalentFeature;
		    			}
		    		}
		    		$scope.setFeature(sequenceReport, feature);
		    	}
		    	if(sequenceReport.rabvReport.sequenceResult.placements == null) {
		    		$scope.setPlacement(sequenceReport, null);
		    	} else {
		    		if(sequenceReport.rabvReport.placement == null) {
			    		$scope.setPlacement(sequenceReport, sequenceReport.rabvReport.sequenceResult.placements[0]);
		    		}
		    	}
		    	item.sequenceReport = sequenceReport;
		    }

			$scope.$watch('displaySection', function(newObj, oldObj) {
				if(newObj == "phyloPlacement") {
					$scope.refreshSlider();
				}
			});
		    
		    $scope.refreshSlider = function() {
		        $timeout(function () {
		        	console.log("rzSliderForceRender");
		            $scope.$broadcast('rzSliderForceRender');
		        });
		    };

		    
		    $scope.setComparisonRef = function(sequenceReport, comparisonRef) {
		    	// need to nest comparisonRef within rabvReport to avoid breaking command doc assumptions.
		    	sequenceReport.rabvReport.comparisonRef = comparisonRef;
		    }

		    $scope.setFeature = function(sequenceReport, feature) {
		    	// need to nest feature within rabvReport to avoid breaking command doc assumptions.
		    	sequenceReport.rabvReport.feature = feature;
		    }

		    $scope.setPlacement = function(sequenceReport, placement) {
		    	// need to nest feature within rabvReport to avoid breaking command doc assumptions.
		    	sequenceReport.rabvReport.placement = placement;
				$scope.refreshSlider();
		    }


			$scope.featureSvgUpdated = function() {
				console.info('featureSvgUpdated');
				var visualisationSvgElem = document.getElementById('featureVisualisationSvg');
				if(visualisationSvgElem != null) {
					var featureName = $scope.fileItemUnderAnalysis.sequenceReport.rabvReport.feature.name;
					console.info('featureName', featureName);
					var featureScrollLeft = $scope.featureNameToScrollLeft[featureName];
					console.info('featureScrollLeft', featureScrollLeft);
					if(featureScrollLeft != null) {
						visualisationSvgElem.scrollLeft = featureScrollLeft;
					} else {
						visualisationSvgElem.scrollLeft = 0;
					}
					$scope.lastFeatureName = featureName;
				} 
				$scope.featureVisualisationUpdating = false;
				
			}
			
			$scope.phyloSvgUpdated = function() {
				$scope.phyloVisualisationUpdating = false;
			}

			$scope.phyloLegendSvgUpdated = function() {
				$scope.phyloLegendUpdating = false;
			}

			$scope.updateFeatureSvgFromUrl = function(cacheKey, svgUrl) {
				if(svgUrl == $scope.featureVisualisationSvgUrl) {
					// onLoad does not get invoked again for the same URL.
					$scope.featureSvgUpdated();
				} else {
					$scope.featureVisualisationSvgUrl = svgUrl;
					$scope.featureSvgUrlCache[cacheKey] = svgUrl;
				}
			}

			$scope.updatePhyloSvgFromResultObject = function(cacheKey, svgResultObject) {
				if(_.isEqual(svgResultObject, $scope.phyloVisualisationSvgResultObject)) {
					// onLoad does not get invoked again for the same URLs.
					$scope.phyloSvgUpdated();
					$scope.phyloLegendSvgUpdated();
				} else {
					$scope.phyloSvgResultObjectCache[cacheKey] = svgResultObject;
					$scope.phyloVisualisationSvgResultObject = svgResultObject;
					$scope.phyloVisualisationSvgUrl = "/glue_web_files/"+
					svgResultObject.treeTransformResult.freemarkerDocTransformerWebResult.webSubDirUuid+"/"+
					svgResultObject.treeTransformResult.freemarkerDocTransformerWebResult.webFileName;
					$scope.phyloLegendSvgUrl = "/glue_web_files/"+
					svgResultObject.legendTransformResult.freemarkerDocTransformerWebResult.webSubDirUuid+"/"+
					svgResultObject.legendTransformResult.freemarkerDocTransformerWebResult.webFileName;
				}
			}

			
			$scope.saveFeatureScrollLeft = function() {
				if($scope.lastFeatureName != null) {
					var visualisationSvgElem = document.getElementById('visualisationSvg');
					if(visualisationSvgElem != null) {
						$scope.featureNameToScrollLeft[$scope.lastFeatureName]	= visualisationSvgElem.scrollLeft;
					}
				}

			}
			
			$scope.updateFeatureSvg = function() {
				
				$scope.featureVisualisationUpdating = true;
				var sequenceReport = $scope.fileItemUnderAnalysis.sequenceReport;
				var visualisationHints = sequenceReport.rabvReport.sequenceResult.visualisationHints;

				var cacheKey = $scope.fileItemUnderAnalysis.file.name+":"+
					sequenceReport.rabvReport.sequenceResult.id+":"+
					sequenceReport.rabvReport.comparisonRef.refName+":"+
					sequenceReport.rabvReport.feature.name;
				console.info('cacheKey', cacheKey);
				
				$scope.saveFeatureScrollLeft();
				
				var featureName = sequenceReport.rabvReport.feature.name;

		    	$scope.lastFeatureName = featureName;

				var cachedSvgUrl = $scope.featureSvgUrlCache[cacheKey];
				
				if(cachedSvgUrl != null) {
					$timeout(function() {
						$scope.updateFeatureSvgFromUrl(cacheKey, cachedSvgUrl);
					});
				} else {
					var fileName = "visualisation.svg";
					console.info('visualisationHints', visualisationHints);
					glueWS.runGlueCommand("module/rabvSvgFeatureVisualisation", 
							{ 
								"invoke-function": {
									"functionName": "visualiseFeatureAsSvg", 
									"document": {
										"inputDocument": {
										    "targetReferenceName": visualisationHints.targetReferenceName,
										    "comparisonReferenceName": sequenceReport.rabvReport.comparisonRef.refName,
										    "featureName": featureName,
										    "queryNucleotides": visualisationHints.queryNucleotides,
										    "queryToTargetRefSegments": visualisationHints.queryToTargetRefSegments,
										    "queryDetails": visualisationHints.queryDetails, 
										    "fileName": fileName
										}
									}
								} 
							}
					).then(function onSuccess(response) {
						    // Handle success
					    var data = response.data;
						console.info('visualiseFeatureAsSvg result', data);
						var transformerResult = data.freemarkerDocTransformerWebResult;
						$scope.updateFeatureSvgFromUrl(cacheKey, "/glue_web_files/"+transformerResult.webSubDirUuid+"/"+transformerResult.webFileName);
					}, function onError(response) {
						    // Handle error
							$scope.featureVisualisationUpdating = false;
							var dlgFunction = glueWS.raiseErrorDialog(dialogs, "visualising genome feature");
							dlgFunction(response.data, response.status, response.headers, response.config);
					});
				}
			}

			
			$scope.updatePhyloSvg = function() {
				
				$scope.phyloVisualisationUpdating = true;
				$scope.phyloLegendUpdating = true;
				var sequenceReport = $scope.fileItemUnderAnalysis.sequenceReport;
				var placement = sequenceReport.rabvReport.placement;

				var cacheKey = $scope.fileItemUnderAnalysis.file.name+":"+
					sequenceReport.rabvReport.sequenceResult.id+":"+
					placement.placementIndex+":"+$scope.neighbourSlider.value;
				console.info('cacheKey', cacheKey);
				

				var cachedSvgResultObject = $scope.phyloSvgResultObjectCache[cacheKey];
				
				if(cachedSvgResultObject != null) {
					$timeout(function() {
						console.info('phylo SVG result object found in cache');
						$scope.updatePhyloSvgFromResultObject(cacheKey, cachedSvgResultObject);
					});
				} else {
					var fileName = "visualisation.svg";
					var legendFileName = "legend.svg";
					var scrollbarWidth = 17;
					glueWS.runGlueCommand("module/rabvSvgPhyloVisualisation", 
							{ 
								"invoke-function": {
									"functionName": "visualisePhyloAsSvg", 
									"document": {
										"inputDocument": {
										    "placerResult" : $scope.fileItemUnderAnalysis.response.rabvWebReport.placerResult, 
										    "queryName" : sequenceReport.rabvReport.sequenceResult.id,
										    "placementIndex" : placement.placementIndex,
										    "maxDistance" : toFixed($scope.neighbourSlider.value/1000, 2),
											"pxWidth" : 1136 - scrollbarWidth, 
											"pxHeight" : 2500,
											"legendPxWidth" : 1136, 
											"legendPxHeight" : 80,
										    "fileName": fileName,
										    "legendFileName": legendFileName
										}
									}
								} 
							}
					).then(function onSuccess(response) {
						// Handle success
					    var data = response.data;
						console.info('visualisePhyloAsSvg result', data);
						var svgResultObj = data.visualisePhyloAsSvgResult;
						$scope.updatePhyloSvgFromResultObject(cacheKey, svgResultObj);
					}, function onError(response) {
					    // Handle error
						$scope.phyloVisualisationUpdating = false;
						$scope.phyloLegendUpdating = false;
						var dlgFunction = glueWS.raiseErrorDialog(dialogs, "visualising phylo tree");
						dlgFunction(response.data, response.status, response.headers, response.config);
					});
				}
			}
			
		    $scope.getPlacementLabel = function(placement) {
		    	return placement.placementIndex + " (" + toFixed(placement.likeWeightRatio * 100, 2) + "%)";
		    }
			
			$scope.downloadExampleSequence = function() {
				var url;
				if(userAgent.os.family.indexOf("Windows") !== -1) {
					url = "exampleSequences/fullGenome1.fasta";
				} else {
					url = "exampleSequencesMsWindows/fullGenome1.fasta";
				}
				$http.get(url)
				.success(function(data, status, headers, config) {
					console.log("data", data);
			    	var blob = new Blob([data], {type: "text/plain"});
			    	saveFile.saveFile(blob, "example sequence file", "exampleSequenceFile.fasta");
			    })
			    .error(glueWS.raiseErrorDialog(dialogs, "downloading example sequence file"));
			};
		    
		    $scope.getMajorClade = function(sequenceResult) {
		    	var majorCladeResult = _.find(sequenceResult.genotypingResult.queryCladeCategoryResult, function(qccr) {return qccr.categoryName == 'major_clade'});
		    	if(majorCladeResult == null) {
		    		return "-";
		    	}
		    	return majorCladeResult.shortRenderedName;
		    };

		    $scope.getMinorClade = function(sequenceResult) {
		    	var minorCladeResult = _.find(sequenceResult.genotypingResult.queryCladeCategoryResult, function(qccr) {return qccr.categoryName == 'minor_clade'});
		    	if(minorCladeResult == null) {
		    		return "-";
		    	}
		    	return minorCladeResult.shortRenderedName;
		    };

		    $scope.getClosestReferenceSequence = function(sequenceResult) {
		    	var majorCladeResult = _.find(sequenceResult.genotypingResult.queryCladeCategoryResult, function(qccr) {return qccr.categoryName == 'major_clade'});
		    	if(majorCladeResult == null) {
		    		return "-";
		    	}
		    	return majorCladeResult.closestTargetSequenceID;
		    };

			
		}]);


