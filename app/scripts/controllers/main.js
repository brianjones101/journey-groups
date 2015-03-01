'use strict';

/**
 * @ngdoc function
 * @name jgroupsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jgroupsApp
 */
angular.module('jgroupsApp')
	.controller('MainCtrl', function($scope, $http) {
		$scope.search = {
			type: 'NONE',
			when: 'ANY',
			time: 'NONE',
			people: 'NONE',
			ages: 'ANY',
			childcare: false
		};

		$scope.updating = false;
		$scope.sendEmail = function(result, evt) {
			ga('send', 'event', 'button', 'click', 'email');
			// Note: to allow mobile devices to use their default email client, uncomment the following:
			//try {
			//  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
			//    // We're on Android or iOS, it seems. Let's let the default handler do its thing.
			//    return;
			//  }
			//}
			//catch (e) {
			//  // Error. Let's do the dialog thing, ok?
			//}
			$scope.contact = {
				group_name: result.name,
				owner_name: result.owner_name._,
				owner_email_primary: result.owner_email_primary,
				name: '',
				email: '',
				phone: ''
			};
			$('.send-email-modal').modal();
			setTimeout(function() {
				$('#c-name').focus();
			}, 500);

			evt.preventDefault();
			return false;
		};
		$scope.submitEmailDialog = function() {
			$scope.contacting = true;

			$http({
				method: 'post',
				url: 'contact',
				data: $scope.contact
			}).success(function(evt) {
				if (!evt || !evt.success) {
					alert(evt && evt.result || 'We had some trouble sending your contact request. Would you try again later, or ask for help?')
				}
				else {
					$('.send-email-modal').modal('hide');
					alert('Sent! ' + $scope.contact.owner_name + ' should be in touch soon!');
					delete $scope.contact;
				}
				$scope.contacting = false;
			});

		};

		$scope.updateResults = function() {
			$scope.updating = true;
			delete $scope.results;

			ga('send', {
				hitType: 'event',
				eventCategory: 'form',
				eventAction: 'submit',
				eventLabel: 'query'
			});
			$http({
				method: 'post',
				url: 'query',
				data: $scope.search
			}).success(function(evt) {
				if (!evt || !evt.success) {
					alert(evt && evt.result || 'We had some trouble looking for groups. Would you try again later, or ask for help?')
				}
				else if (!evt.result || evt.result.length === 0) {
					alert('No groups match what you searched for!');
				}
				else {
					ga('send', {
						hitType: 'event',
						eventCategory: 'form',
						eventAction: 'submit',
						eventLabel: 'result',
						eventValue: evt && evt.result && evt.result.length || 0
					});
					$scope.results = evt.result;

					setTimeout(function() {
						var resultsAnchor = document.getElementById('results');
						resultsAnchor && resultsAnchor.scrollIntoView && resultsAnchor.scrollIntoView();
					}, 100);
				}
				$scope.updating = false;
			});
		};
	});
