angular.module('starter.controllers', [])

.controller('ChannelCtrl', function($scope, $location, $ionicLoading, $ionicPopup) {
  $scope.number = /^[0-9]*$/;
  $scope.login = function(user){
    $scope.logging = $ionicLoading.show({
      content: '登入中ing...',
    });
    MemberService.login(function(status) {
      $scope.logging.hide();
      if ( status === true ) {
          $location.path('/menu/order/wait');
      }else if ( status === false ) {
          $ionicPopup.alert({
            title: '登入失敗',
            content: '聯絡電話/密碼 錯誤！',
          });
      }else{
        $ionicPopup.alert({
          title: '登入失敗',
          content: '網路連線異常！',
        });
      }
    });
  };
})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.leftButtons = [{
    type: 'button-icon icon ion-navicon',
    tap: function(e) {
      $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
    }
  }];
  $scope.toggleMenu = function () {
    $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
  }
});