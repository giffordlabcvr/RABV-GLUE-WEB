rabvApp.controller('versionInfoCtrl', 
		[ '$scope', 'glueWS', 'dialogs', 
		function($scope, glueWS, dialogs) {

			glueWS.runGlueCommand("", {
			    "glue-engine":{
			        "show-version":{}
			    }
			})
			.success(function(data, status, headers, config) {
				$scope.glueEngineVersion = data.glueEngineShowVersionResult.glueEngineVersion;
			})
			.error(glueWS.raiseErrorDialog(dialogs, "retrieving GLUE engine version"));
			
			glueWS.runGlueCommand("", {
			    "show":{
			        "setting":{
			            "settingName":"project-version"
			        }
			    }
			})
			.success(function(data, status, headers, config) {
				$scope.rabvGlueProjectVersion = data.projectShowSettingResult.settingValue;
			})
			.error(glueWS.raiseErrorDialog(dialogs, "retrieving project-version setting"));


			glueWS.runGlueCommand("", {
			    "show":{
			        "extension-setting":{
			            "extensionName":"ncbi_rabv",
				        "extSettingName":"extension-version"
			        }
			    }
			})
			.success(function(data, status, headers, config) {
				$scope.ncbiRabvGlueExtensionProjectVersion = data.projectShowExtensionSettingResult.extSettingValue;
			})
			.error(glueWS.raiseErrorDialog(dialogs, "retrieving ncbi_rabv extension-version setting"));

			glueWS.runGlueCommand("", {
			    "show":{
			        "extension-setting":{
			            "extensionName":"ncbi_rabv",
			            "extSettingName":"extension-build-date"
			        }
			    }
			})
			.success(function(data, status, headers, config) {
				$scope.ncbiRabvGlueExtensionBuildDate = data.projectShowExtensionSettingResult.extSettingValue;
			})
			.error(glueWS.raiseErrorDialog(dialogs, "retrieving ncbi_rabv extension-build-date setting"));

			glueWS.runGlueCommand("", {
			    "show":{
			        "extension-setting":{
			            "extensionName":"ncbi_rabv",
			            "extSettingName":"extension-build-id"
			        }
			    }
			})
			.success(function(data, status, headers, config) {
				$scope.ncbiRabvGlueExtensionBuildId = data.projectShowExtensionSettingResult.extSettingValue;
			})
			.error(glueWS.raiseErrorDialog(dialogs, "retrieving ncbi_rabv extension-build-id setting"));

			
		} ]);
