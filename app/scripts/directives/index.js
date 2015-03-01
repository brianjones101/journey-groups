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
			compile: function(element, attrs) {
				if (!attrs.type) {
					attrs.type = 'text';
					console.log('set type');
				}
				console.log(attrs);
			},
			templateUrl: '/scripts/directives/formInput.html'
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
