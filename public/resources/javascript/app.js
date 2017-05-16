var protocol = location.protocol;
var slashes = protocol.concat("//");
var host = slashes.concat(window.location.hostname);
var socket = io.connect(host);

angular.module('cctvViewApp', [])
    .controller('CCTVViewController', function ($scope, $http) {

        $scope.port = 11000;
        $scope.endPoints = {
            up: '/api/up',
            down: '/api/down',
            left: '/api/left',
            right: '/api/right',
            reset: '/api/reset'
        };
        $scope.cctvServerLinks = [];
        $scope.angle = {
            tilt: 0,
            pan: 0
        };
        $scope.angleModifier = 10;

        $scope.newForm = false;

        $scope.getLinkForId = function (id) {
            return ('http://' + $scope.cctvServerLinks[id].link + ':' + $scope.port);
        };

        $scope.up = function (ip) {
            ip = '192.168.0.22';
            $scope.angle.tilt -= $scope.angleModifier;
            console.log($scope.test);
            $http.get('http://' + ip + ':8080' + $scope.endPoints.up + '?angle=' + $scope.angle.tilt);
        };

        $scope.down = function (ip) {
            ip = '192.168.0.22';
            $scope.angle.tilt += $scope.angleModifier;
            $http.get('http://' + ip + ':8080' + $scope.endPoints.down + '?angle=' + $scope.angle.tilt);
        };

        $scope.left = function (ip) {
            ip = '192.168.0.22';
            $scope.angle.pan += $scope.angleModifier;
            console.log($scope.test);
            $http.get('http://' + ip + ':8080' + $scope.endPoints.left + '?angle=' + $scope.angle.pan);
        };

        $scope.right = function (ip) {
            ip = '192.168.0.22';
            $scope.angle.pan -= $scope.angleModifier;
            $http.get('http://' + ip + ':8080' + $scope.endPoints.right + '?angle=' + $scope.angle.pan);
        };

        $scope.reset = function (ip) {
            ip = '192.168.0.22';
            $scope.angle += $scope.angleModifier;
            $http.get('http://' + ip + ':8080' + $scope.endPoints.reset);

            $scope.angle = {
                tilt: 0,
                pan: 0
            };
        };

        $scope.newCCTVLink = function () {
            $scope.newForm = true;
        };

        $scope.cancelCCTVLink = function () {
            $scope.newForm = false;
        };

        $scope.finaliseCCTVLink = function () {
            new CCTVLink($scope.title, $scope.link);
            $scope.title = '';
            $scope.link = '';
        };

        function CCTVLink(title, link) {
            this.title = title;
            this.link = link;
            $scope.cctvServerLinks.push(this);
        }

        $scope.checkCCTVLinkStatus =  function(id) {
            socket.emit('checkCCTVServer', $scope.cctvServerLinks[id]);
        };

        // $scope.$watch('cctvServerLinks', function () {
        //     socket.emit('addCCTVToServerList', $scope.cctvServerLinks);
        // });

        socket.on('cctvServerList', function (data) {
            $scope.$apply(function() {
                $scope.cctvServerLinks = data;
            });
        });

    });
angular.element(function() {
    angular.bootstrap(document, ['cctvViewApp']);
});