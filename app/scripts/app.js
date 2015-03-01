'use strict';

/**
 * @ngdoc overview
 * @name jgroupsApp
 * @description
 * # jgroupsApp
 *
 * Main module of the application.
 */
angular
	.module('jgroupsApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch'
	])
	.filter('encodeURIComponent', function() {
		return window.encodeURIComponent;
	})
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/start-a-group', {
				templateUrl: 'views/group.html',
				controller: 'GroupCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
