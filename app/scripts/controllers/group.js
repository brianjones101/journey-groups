'use strict';

/**
 * @ngdoc function
 * @name jgroupsApp.controller:GroupCtrl
 * @description
 * # GroupCtrl
 * Controller of the jgroupsApp
 */
angular.module('jgroupsApp')
	.controller('GroupCtrl', function($scope, $http) {
		$scope.saving = false;
		$scope.group = newGroup();
		setTimeout(function() {
			$('#jg-yourname').focus();
		}, 500);

		function newGroup() {
			return {
				udf_group_pulldown_1_id: '1',
				udf_group_pulldown_2_id: '3',
				udf_group_pulldown_3_id: '4',
				meeting_day_id: '4',
				meeting_time_id: '8'
			}
		}

		$scope.startAGroup = function() {
			$scope.saving = true;
			$scope.group.public_search_listed = false;
			$scope.group.listed = false;
			$scope.group.group_type_id = '1';

			$http({
				method: 'post',
				url: 'group',
				data: $scope.group
			}).success(function(evt) {
				if (!evt || !evt.success) {
					alert(evt && evt.result || 'We had some trouble sending your group request. Would you try again later, or ask for help?')
				}
				else {
					alert('Created! We will be in touch soon!');
					$scope.group = newGroup();
				}
				$scope.saving = false;
			});
		};
	});
