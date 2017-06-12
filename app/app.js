(function(angular) {
    'use strict';

    angular
        .module('app', ['ngMaterial'])
        .component('timeline', {
            transclude: true,
            controller: timelineCtrl,
            controllerAs: 'vm',
            template: `<div class="container player-list" layout="row" flex>
                            <md-sidenav md-is-locked-open="$mdMedia('gt-sm')" class="md-whiteframe-4dp" md-component-id="left">
                                <md-list ng-click="vm.toggleLessonList()">
                                    <md-list-item ng-repeat="h in vm.team.home.players">
                                        <a class="md-button home" id="btn" ng-click="vm.selectPlayer(h); vm.setActive(h, vm.team.home.players, vm.team)" index="$index" ng-class="{active: h.active}"><img ng-src="assets/img/senators/{{s.id}}.jpg" alt="" class="ph-image"> {{h.player_name}}</a>
                                    </md-list-item>
                                    <md-list-item ng-repeat="a in vm.team.away.players">
                                        <a class="md-button away" id="btn" ng-click="vm.selectPlayer(a); vm.setActive(a, vm.team.away.players, vm.team)" index="$index" ng-class="{active: a.active}"><img ng-src="assets/img/senators/{{s.id}}.jpg" alt="" class="ph-image"> {{a.player_name}}</a>
                                    </md-list-item>
                                </md-list>
                            </md-sidenav>
                            <md-content id="content">
                                <section class="section intro">
                                    <div class="container">
                                        <h1>Horizontal Timeline &rarr;</h1>
                                        <h3>12 minutes in seconds</h3>
                                        <div style="">
                                            <md-input-container style="color:#fff; width:200px;">
                                                <label>Minutes...</label>
                                                <input type="number" id="minutes" ng-model="vm.move" ng-change="vm.addAction(vm.team)" min="0" max="12" />
                                            </md-input-container>
                                            {{vm.move}}
                                        </div>
                                    </div>
                                </section>
                                <section class="timeline">
                                    <div id='hr'>
                                        <div ng-repeat="h in vm.team.home.players" style="display:inline-block">
                                            <div id='{{h.id}}' class="mark" ng-class="{sameminutes: vm.ljMinutes === vm.kiMinutes}"><p ng-if="vm.ljMinutes != vm.kiMinutes">{{h.initials}}</p><p ng-if="vm.ljMinutes === vm.kiMinutes">{{vm.team.home.players.length}}</p></div>
                                        
                                        </div>
                                       
                                        <ol>
                                            <li><span>72</span></li>
                                            <li><span>144</span></li>
                                            <li><span>216</span></li>
                                            <li><span>288</span></li>
                                            <li><span>360</span></li>
                                            <li><span>432</span></li>
                                            <li><span>504</span></li>
                                            <li><span>576</span></li>
                                            <li><span>648</span></li>
                                            <li><span>720</span></li>
                                        </ol>
                                        <div ng-repeat="a in vm.team.away.players" style="display:inline-block">
                                            <div id='{{a.id}}' class="mark red">{{a.initials}}</div>
                                        </div>
                                </section>
                            </md-content>
                        </div>`

        })


    function timelineCtrl($scope, $timeout, $mdSidenav) {

        var self = this;

        //DEFINE FUNCTIONS
        self.init = init;
        self.addAction = addAction;
        self.selectPlayer = selectPlayer;
        self.setActive = setActive;

        
        self.initial = '';
        self.move = 0;

        $scope.index = null;
        console.log($scope.index);

        var selectedId = '';
        var selectedPlayer = '';








        self.lengthOfPeriodInSeconds = 720; //12 minutes in miliseconds aka timeline

        function init(lengthOfPeriodInSeconds) {
            var d = document.getElementById('hr');

            d.style.width = (self.lengthOfPeriodInSeconds / 12 - 1) + 'vw';
            // addAction();
        }

        self.team = {
            home: {
                players: [{
                        id: 'h1',
                        player_name: 'LeBron James',
                        initials: 'LJ',
                        counter: 0
                    }, {
                        id: 'h2',
                        player_name: 'Kyrie Irving',
                        initials: 'KI',
                        counter: 0
                    }

                ]
            },
            away: {
                players: [{
                        id: 'a1',
                        player_name: 'Kevin Durant',
                        initials: 'KD',
                        counter: 0
                    }, {
                        id: 'a2',
                        player_name: 'Steph Curry',
                        initials: 'SC',
                        counter: 0
                    }

                ]
            }
        }

        console.log(self.team, 'myTeam object');


        // timeInSeconds = playingTime //example lebron plays first 8 minutes then checks out
        // team object has home and away
        // team.home has a player_name: example team.home[0].players.player_name = lebron james
        function addAction(team) {
            var home = team.home.players;
            var away = team.away.players;

             var d = document.getElementById(selectedId);
            console.log(self.move, 'move')
            var minutes = self.move * 60;
            selectedPlayer.counter = minutes;
            self.playerMoves = selectedPlayer.counter;
            d.style.left = minutes + 'px';
            console.log(team, 'adding minutes')


            home.some(function(h) {
                if (h.initials === 'LJ') {
                    h.ljMinutes = h.counter;
                    self.ljMinutes = h.ljMinutes;
                }

                 if (h.initials === 'KI') {
                    h.kiMinutes = h.counter;
                    self.kiMinutes = h.kiMinutes;
                }


            


            })

            away.some(function(a) {
                if (a.initials === 'KD') {
                    a.kdMinutes = a.counter;
                }

                if (a.initials === 'SC') {
                    a.scMinutes = a.counter;
                }


            })

            

        }



        function selectPlayer(player) {
            console.log(player, 'selected player')
                //self.gettingvotes = true;
            selectedId = player.id;
            selectedPlayer = player;

            $mdSidenav('left').toggle();
            //self.getVotes();

        }

        function setActive(item, list, team) {

            console.log(team, 'team');
            console.log(list, 'list')

            var home = team.home.players;
            var away = team.away.players;

            home.some(function(h) {
                if (h.active) {
                    h.active = false;
                }


            })

            away.some(function(a) {
                if (a.active) {
                    a.active = false;
                }


            })

            self.move = '';
            item.active = true;

        }


        self.init(self.lengthOfPeriodInSeconds);

    }

})(window.angular);
