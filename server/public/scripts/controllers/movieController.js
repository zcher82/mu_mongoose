app.controller('MovieController', ['$scope', '$http', function ($scope, $http) {
  $scope.movies = [];
  $scope.currentMovie = {};
  $scope.displayedMovieId = '';             //scoped variables
  $scope.newComment = {};

  getMovies();  // When MovieController is loaded, getMovies function is called, populating the page with DB info, specifically movies in movie listing section

  $scope.submitCurrentMovie = function () { //submitCurrentMovie function
    var data = $scope.currentMovie;         //data to be posted = currentMovie object, which is obtained through ng-model when submit button is clicked by user
    $http.post('/movies', data)     //url is '/movies'   data to be posted is data, which is the currentMovie object
      .then(function () {
        console.log('POST /movies');
        getMovies();      //getMovies function is called to repopulate the DOM again
      });
  };

  $scope.updateMovie = function (movie) {
    var movieId = movie._id;      //the movie._id of the updated movie is set to equal movieID
    delete movie._id;        //movie._id is deleted because we don't want to confuse the PUT by updating the _id as well, only updating movie and/or releaseDate
    $http.put('/movies/' + movieId, movie) //PUT request; URL = '/movies/' + movieID; we're updating movie
      .then(function (response) {
        console.log('PUT /movies ', movie);
        getMovies();    //getMovies is called after UPDATING the DB with new data
      });
  };

  $scope.deleteMovie = function (id) {
    $http.delete('/movies/' + id)     //ajax call to DELETE movie linked to specific id. id = movie._id as reference in index.html.
      .then(function (response) {
        console.log('DELETE /movies ', id);
        getMovies();    //getMovies is called after DELETING movie from DB to repopulate the DOM
      });
  };

  $scope.showComments = function (id) {  //showComments function called with movie._id as argument as referenced in index.html
    console.log('showComments', id);
    $scope.displayedMovieId = id;   //sets $scoped variable, displayedMovieId, equal to id (movie._id).
  };

  $scope.submitComment = function (id) {    //submitComment function called with movie._id as argument as referenced in index.html. unique id is used
    // update the movie                       //to distinguish which movie is to be updated
    var comment = $scope.newComment;    //newComment object is saved as variable "comment"
    $('#commentForm')[0].reset();
    $http.put('/movies/' + id + '/comments', comment)   //ajax call to update DB; "comment" is the object that is created when input is updated on DOM
      .then(function (response) {
        console.log('PUT /comments ', comment);
        //$scope.newComment = '';
        getMovies();    //getMovies is called after new updates are made in DB in order to update DOM with newest data
      });
  };

  function getMovies() {    //function to get current data from DB and display it on DOM
    $http.get('/movies')    //ajax call to GET data from route '/movies'
      .then(function (response) {   //if successful, execute below
        response.data.forEach(function (movie) {    //for each object in response array, do this (below)
          movie.releaseDate = new Date(movie.releaseDate);    //'movie' is what we arbitrarily call each object in the returned array. we set it equal to 'new Date(date as defined by movie.releaseDate)'
        });

        $scope.movies = response.data;    //$scoped 'movies' here is the array...the returned data
        console.log('GET /movies ', response.data);

      });
  }
}]);
