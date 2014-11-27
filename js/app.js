"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var productUrl = 'https://api.parse.com/1/classes/comments';

angular.module('ProductReviewApp', ['ui.bootstrap'])
	.config(function($httpProvider) {
		$httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'nbyRVy84QPakEjbnhoWAT582epoOgCsgSCPXz61K';
		$httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'n1xY8uuz9JRQghjL1qp0xfsRolTUvGnAduN5DBQF';
	})
	.controller('ReviewsController' , function($scope, $http) {
		$scope.refreshComments = function() {
			$scope.loading = true;
			$http.get(productUrl + '?order=-score')
			.success(function(data){
				$scope.comments = data.results;
				
			})
			.error(function(err){
				$scope.errorMessage = err;
			})
			.finally(function(){
				$scope.loading = false;
			});
		};

		$scope.refreshComments();
		$scope.newComment = {score: 0};
		$scope.addComment = function() {
			$scope.updating = true;
			$http.post(productUrl, $scope.newComment)
				.success(function(responseData) {
					$scope.newComment.objectId = responseData.objectId;
					$scope.comments.push($scope.newComment);
					$scope.newComment = {score: 0};
				})
				.error(function(err) {
					$scope.errorMessage = err;
				})
				.finally(function(){
					$scope.updating = false;
				});
		}; // end of addComment
		$scope.incrementRating = function(comment, amount){
			$scope.updating = true;
				$http.put(productUrl + '/' + comment.objectId, {
					score: {
						__op: 'Increment',
						amount: amount
					}
				}) 
				.success(function(responseData){
					console.log(responseData);
					comment.score = responseData.score;
				})
				.error(function(err){
					console.log(err);
				})
				.finally(function(){
					$scope.updating = false;
				})
		};//end of incrementRating

		$scope.deleteComment = function(comment) {
			$scope.deleting = true;
			var index = $scope.comments.indexOf(comment);
			$scope.comments.splice(index, 1);
			$http.delete(productUrl + '/' + comment.objectId)
				.success(function(responseData){
					console.log(responseData);
					comment.className='hidden';
				})
				.error (function(err){
					console.log(err);
				})
				.finally(function(){
					$scope.deleting = false;
				})
		}; //end of delete comment
	})