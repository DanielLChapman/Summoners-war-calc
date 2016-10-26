app.controller('MainController', ['$scope', function($scope) {
  $scope.title = 'Do you have a 5* ready to go?';
  $scope.promo = 'promo code';
  $scope.checkboxModel = {
    value2: 'YES'
  };
  //Experience Needed
  $scope.speed = 60;
  $scope.xp = 3900;
  $scope.twoStarsExp = 35822;
  $scope.threeStarsExp = 82182;
  $scope.fourStarsExp = 189750;
  $scope.fiveStarsExp = 446647;
  $scope.faimonExp = 1950;
  $scope.timeNeeded = 0;
  //number of monsters needed
  $scope.twoStars = [200, 100];
  $scope.threeStars = [75, 25];
  $scope.fourStars = [20, 5];
  $scope.fiveStars = [5, 0];
  //min level, max level
  $scope.haveTwoStars = [0, 0];
  $scope.haveThreeStars = [0, 0];
  $scope.haveFourStars = [0, 0];
  $scope.haveFiveStars = [0, 0];
  $scope.needed = [0, 0, 0, 0];
  //if they need to make another 5*, then increase the calculation variables
  $scope.$watch('checkboxModel.value2', function() {
    if ($scope.checkboxModel.value2 == 'YES') {
      $scope.twoStars = [200, 100];
      $scope.threeStars = [75, 25];
      $scope.fourStars = [20, 5];
      $scope.fiveStars = [5, 0];
    } else {
      $scope.twoStars = [240, 120];
      $scope.threeStars = [90, 30];
      $scope.fourStars = [24, 6];
      $scope.fiveStars = [5, 1];
    }
    $scope.calculate();
  });
  //Initial Calculations
  var test = ['haveFiveStars[0]', 'haveFiveStars[1]', 'haveFourStars[1]', 'haveFourStars[0]', 'haveThreeStars[0]', 'haveThreeStars[1]', 'haveTwoStars[1]', 'haveTwoStars[0]', 'speed', 'xp'];
  $scope.$watchGroup(['haveFiveStars[0]', 'haveFiveStars[1]', 'haveFourStars[1]', 'haveFourStars[0]', 'haveThreeStars[0]', 'haveThreeStars[1]', 'haveTwoStars[1]', 'haveTwoStars[0]', 'speed', 'xp'], function(newValues, scope) {
    /*for (var i = 0; i < newValues.length; i++) {
    }
    *Old purpose, legacy code left incase it needs to be revived. 
    */
    $scope.calculate();

  });
  //Number of 5 stars needed.
  $scope.temp = 0;
  $scope.calculate = function() {
    //number of 5 stars needed.
    if ($scope.haveFiveStars[0] >= ($scope.fiveStars[0] + $scope.fiveStars[1])) {
      $scope.needed[3] = 0;
    } else {
      $scope.needed[3] = ($scope.fiveStars[0] + $scope.fiveStars[1]) - $scope.haveFiveStars[0];
    }
    //if we need more 5 stars, then lets look at 4 stars, otherwise we are done
    if ($scope.needed[3] > 0) {
      //Check if there are any 4 stars ready to evolve.
      $scope.temp = $scope.needed[3] - $scope.haveFourStars[1];
      //we have enough 4*s to evolve, we can move on to the next check
      //take the number of 5 stars we need, multiple it by 4 and thats how many more 4 stars we need to evolve the 4stars elready maxed.
      if ($scope.temp <= 0) {
        $scope.needed[2] = $scope.needed[3] * 4;
      } else {
        //We need needed[3] amount of 5 stars, which will be needed[3] + needed[3] * 4; Temp is how many more 4 stars need to be leveled. Temp + haveFourStars should never be greater then 5. 
        $scope.needed[2] = $scope.temp + $scope.temp * 4 + $scope.haveFourStars[1] * 4;
      }
      //So now we know how many 4 stars we needed, lets subtract how many unleveled we have.
      $scope.needed[2] -= $scope.haveFourStars[0];
      //if this number is less then 1, then we can stop. 
      if ($scope.needed[2] >= 1) {
        //So we need more 4 stars, how many more 3 stars do we need
        //Get the number of 4 stars needed and substract by the amount of 3 stars ready to level up
        $scope.temp = $scope.needed[2] - $scope.haveThreeStars[1];
        
        if ($scope.temp <= 0) {
          $scope.needed[1] = $scope.needed[2] * 3;
        }
        else {
          $scope.needed[1] = $scope.temp + $scope.temp * 3 + $scope.haveThreeStars[1] * 3;
        }
        $scope.needed[1] -= $scope.haveThreeStars[0];
        if ($scope.needed[1] < 0) {
          $scope.needed[1] = 0;
        }
        if ($scope.needed[1] >= 1) {
          //So we need more 3 stars, how many more 2 stars do we need
          //Get the number of 3 stars needed and substract by the amount of 2 stars ready to level up
          $scope.temp = $scope.needed[1] - $scope.haveTwoStars[1];

          if ($scope.temp <= 0) {
            $scope.needed[0] = $scope.needed[1] * 2;
          }
          else {
            $scope.needed[0] = $scope.temp + $scope.temp * 2 + $scope.haveTwoStars[1] * 2;
          }
          $scope.needed[0] -= $scope.haveTwoStars[0];
        }
        else {
          //If there is enough 3 stars, clear out the 2 stars
          $scope.needed[0] = 0;
        }
      }
      else {
        //If there is enough 4 stars, then clear out the 3 and 2 stars
        $scope.needed[0] = 0;
        $scope.needed[1] = 0;
      }
    }
    else {
      $scope.needed = [0,0,0,0]
    }
    
    
    //calculating EXP
    /* 
    *Calculate the total amount of experience needed for every monster that the user has to level up.
    *The user can level 3 monsters at once so divide the total number by 3.
    *Divide the totalXp by the amount of xp the user gets per run to get how many runs the user needs. 
    *Times that by the amount of seconds it takes to do a run
    *Load that into the time needed.
    */
    var totalXp = parseFloat(($scope.needed[1]-$scope.haveTwoStars[1])*35822+($scope.needed[2]-$scope.haveThreeStars[1])*82182+($scope.needed[3]-$scope.haveFourStars[1])*189750+$scope.fiveStars[1]*446647);
    var totalXp = parseFloat(totalXp/3);
    var totalXp = parseFloat(totalXp/$scope.xp);
    var totalXp = parseFloat(totalXp*$scope.speed);
    $scope.timeNeeded = parseFloat(totalXp/60);
    $scope.timeNeeded = parseFloat($scope.timeNeeded/60);
  }
  
}]);