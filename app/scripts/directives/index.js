angular.module('jgroupsApp')
	.directive('formGroup', function() {
		return {
			restrict: 'E',
			transclude: true,
			replace: true,
			scope: {
				name: '@',
				label: '@'
			},
			templateUrl: '/scripts/directives/formGroup.html'
		};
	})
	.directive('formInput', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				name: '@',
				model: '=',
				type: '@'
			},
			templateUrl: '/scripts/directives/formInput.html'
		};
	})
	.directive('formInputTime', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				name: '@',
				model: '='
			},
			templateUrl: '/scripts/directives/formInputTime.html'
		};
	})
	.directive('formHint', function() {
		return {
			restrict: 'E',
			transclude: true,
			replace: true,
			templateUrl: '/scripts/directives/formHint.html'
		};
	})
;
