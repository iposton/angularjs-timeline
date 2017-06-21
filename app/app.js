(function(angular) {
    'use strict';

    angular
        .module('app', ['ngMaterial'])
        .component('timeline', {
            transclude: true,
            controller: timelineCtrl,
            controllerAs: 'vm',
            template: `<div class="container player-list" layout="row" flex>
                        <md-button class="menu" ng-click="vm.toggleList()" hide-gt-sm aria-label="Show list sidenav">
                            menu
                        </md-button>
                        <md-sidenav md-is-locked-open="$mdMedia('gt-sm')" class="md-whiteframe-4dp" md-component-id="left">
                            <md-list ng-click="vm.toggleLessonList()">
                                <md-list-item ng-repeat="h in vm.team.home.players">
                                    <a class="md-button home" id="btn" ng-click="vm.selectPlayer(h); vm.setActive(h, vm.team.home.players, vm.team)" index="$index" ng-class="{active: h.active}" on-load-clicker> {{h.player_name}}</a>
                                </md-list-item>
                                <md-list-item ng-repeat="a in vm.team.away.players">
                                    <a class="md-button away" id="btn" ng-click="vm.selectPlayer(a); vm.setActive(a, vm.team.away.players, vm.team)" index="$index" ng-class="{active: a.active}"> {{a.player_name}}</a>
                                </md-list-item>
                            </md-list>
                        </md-sidenav>
                        <md-content id="content">
                            <section class="section intro">
                                <div class="container">
                                    <h1>Horizontal Timeline &rarr;</h1>
                                    <h3>12 minutes in seconds</h3>
                                    <div>
                                        <md-input-container>
                                            <label>Minutes...</label>
                                            <input type="number" id="minutes" ng-model="vm.mins" ng-change="vm.addAction(vm.playerMinutes, vm.team)" min="0" max="12" />{{vm.playerMinutes}}
                                        </md-input-container>
                                        
                                        {{vm.move}}
                                    </div>
                                </div>
                            </section>
                            <section class="timeline">
                                <div id='hr'>
                                    <div ng-repeat="h in vm.team.home.players" style="display:inline-block">
                                        <div id='{{h.id}}' class="mark" ng-class="{sameminuteshome: vm.sameMinutesHome.length > 1}">{{h.initials}}</div>
                                    </div>
                                    
                                    <div ng-if="vm.sameMinutesHome.length > 1" class="sameminutes-home-block" style="left:{{vm.sameMinutesHome[0].counter}}px">{{vm.sameMinutesHome.length}}</div>
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
                             
                                    <div ng-repeat="a in vm.team.away.players | limitTo: 1" style="display:inline-block">
                                    
                
                                   
                                        <div ng-if="vm.countZero > 1" class="sameminutes-away-block" style="">{{vm.countZero}}a</div>
                                        <div ng-if="vm.countSame > 1" class="sameminutes-away-block" style="left:{{vm.holdCounter}}px">{{vm.countSame}}b</div>
                                    </div>
                                    <div ng-repeat="a in vm.team.away.players" style="display:inline-block">
                                    
                
                                        <div id='{{a.id}}' class="mark red" ng-class="{sameminutesaway: a.same === true}" style="left:{{a.counter}}px">{{a.initials}}</div>
                                     
                                    </div>

                                    
                     
                            </section>
                            <div class="instructions">
                                Home = <span class="home-block">&nbsp&nbsp </span> &nbsp Away = <span class="away-block">&nbsp&nbsp </span> </br> Select a player in the side navigation and then use the input box to add Minutes played. The Max value is 12 minutes. This Timeline represents one quarter of professional basketball with a timeline displaying 12 minutes in seconds.
                            </div>
                        </md-content>
                       </div>`

        })
        .directive('onLoadClicker', function($timeout, $mdSidenav) {
            //This directive auto selects first player in side-nav
            return {
                restrict: 'A',
                scope: {
                    index: '=index'
                },
                link: function($scope, iElm) {
                    if ($scope.index === 0) {
                        $timeout(function() {
                            iElm.triggerHandler('click');
                            $mdSidenav('left').toggle();
                        }, 0);
                    }
                }
            };
        });


    function timelineCtrl($scope, $timeout, $mdSidenav) {

        var self = this;

        //DEFINE FUNCTIONS
        self.init = init;
        self.addAction = addAction;
        self.selectPlayer = selectPlayer;
        self.setActive = setActive;
        self.toggleList = toggleList;


        //Globals
        self.initial = '';
        self.mins = 0;
        self.sameMinutesHome = [];

        var selectedPlayer = '';
        var selectedId = '';




        //Define team data object
        //Iterate in view to display values
        self.team = {
            away: {
                players: [{
                        id: 'h1',
                        player_name: 'LeBron James',
                        initials: 'LJ',
                        counter: 0,
                        location: 'away',
                        same: false,
                        last: false

                    }, {
                        id: 'h2',
                        player_name: 'Kyrie Irving',
                        initials: 'KI',
                        counter: 0,
                        location: 'away',
                        same: false,
                        last: false

                    }, {
                        id: 'h3',
                        player_name: 'Richard Jefferson',
                        initials: 'RJ',
                        counter: 0,
                        location: 'away',
                        same: false,
                        last: false
                    }

                ]
            },
            home: {
                players: [{
                        id: 'a1',
                        player_name: 'Kevin Durant',
                        initials: 'KD',
                        counter: 0,
                        location: 'home',
                        same: false,
                        last: false
                    }, {
                        id: 'a2',
                        player_name: 'Steph Curry',
                        initials: 'SC',
                        counter: 0,
                        location: 'home',
                        same: false,
                        last: false
                    }

                ]
            }
        }

        //Define timeline length in this case seconds equal pixels 
        self.lengthOfPeriodInSeconds = 720; //12 minutes in seconds aka timeline

        function init(lengthOfPeriodInSeconds) {
            //Render timeline width by element id
            var d = document.getElementById('hr');
            d.style.width = (self.lengthOfPeriodInSeconds / 12 - 1) + 'vw';
        }

        function addAction(timeInSeconds, team) {
            //self.addMore = addMore;

            //Define Home and Away players from team object
            var home = team.home.players;
            var away = team.away.players;
            //Get ID of the selected player
            var d = document.getElementById(selectedId);
            //Multiply model value entered in input by 60 to represent 1 minute
            var minutes = self.mins * 60;
            selectedPlayer.counter = minutes;
            self.playerMinutes = selectedPlayer.counter;
            //Style div by selected id move left time represented in pixels
            d.style.left = minutes + 'px';
            var sameToItself;


            if (self.sameMinutesHome.length <= 2 && selectedPlayer.location === 'home') {
                home.filter(function(h) {
                    if (self.sameMinutesHome.length < 2 && h.counter === minutes) {
                        h.same = true;
                        self.sameMinutesHome.push(h);

                    }


                });

                home.filter(function(h) {
                    if (h.counter != minutes) {
                        h.same = false;
                        self.sameMinutesHome = [];

                    }

                });

            }

            if (selectedPlayer.location === 'away') {
                var countZero = 0;
                var countSame = 0;

                angular.forEach(away, function(a) {

                    if (a.counter === 0) {
                        a.same = true;
                        //count counters that are at zero minutes
                        countZero += 1;
                        self.countZero = countZero;
                        console.log(self.countZero, 'count for zero counter');

                        //if a user goes back to zero
                        if (a.counter === 0 && countZero > 1) {
                            a.same = true;
                        }

                        // if (countSame === 1) {
                        //     console.log(countSame, "countSame at zero");
                        //     //a.same = false;
                        //     self.countSame = countSame;
                        //     countSame = countSame;
                        //     console.log(countSame, 'countSame at zero dont count');
                        // } 

                        //sameToItself = false;

                    }



                    if (a.counter > 0) {



                        if (a.counter === selectedPlayer.counter) {

                            countSame += 1;
                            self.countSame = countSame;

                            sameToItself = true;
                            //console.log(a, 'nothing mathces my counter Iam false');
                            a.same = false;
                            //sameToItself = countSame;
                            console.log(countSame, 'if nothing matches selected should equal 1 else 2');
                            console.log(a, 'this player matches selectedPlayer for same counters');
                            self.holdCounter = a.counter;
                            //if same count is 1 do something keep piece false
                            //if count is 2 make a group make piece true to hide and only show group 

                        }

                    }

                })

                var countNotSelected = 0;
                angular.forEach(away, function(a) {

                    if (a.counter > 0) {

                        if (countSame > 1) {
                            sameToItself = false;
                            a.same = true;
                            //countSame += 1;
                            self.countSame = countSame;
                            self.holdCounter = a.counter;
                            console.log(countSame, 'whats the count? should be 2');
                            console.log(self.holdCounter, 'whats the holdCounter?');
                            console.log(a, 'we are equal to selected player');


                        } else {



                            if (a.active === false) {
                                //self.holdCounter = a.counter;
                                console.log(a, 'countNotSelected');
                                console.log(self.holdCounter, 'whats the hold counter? if active false');
                                console.log(a.counter, 'if a.counter === a.counter');
                                if (a.counter === a.counter) {
                                    countNotSelected += 1;

                                    self.holdCounter = a.counter;
                                    console.log(countNotSelected, 'countNotSelected has a match if count is 2 else its solo');
                                }

                            }



                        }

                        if (countNotSelected > 1) {
                            self.countSame = countNotSelected;
                        }

                        if (countSame > 1 && self.holdCounter != a.counter) {
                            a.same = false;

                        }

                    }

                    //adjust this if you add more players to team
                    if (a.counter === 0 && countZero === 1) {
                        console.log(a, "making this false");
                        console.log(countSame, "checking countSame when last zero selected");
                        a.same = false;
                    }


                });

            }

        }

        function selectPlayer(player) {
            console.log(player, 'selected player');
            selectedId = player.id;
            selectedPlayer = player;
            self.mins = player.counter / 60;
            $mdSidenav('left').toggle();
            self.addAction(self.playerMinutes, self.team);

        }
        //Set active class in side-nav
        function setActive(item, list, team) {
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
        //Toggle side-nav on mobile
        function toggleList($event) {
            $mdSidenav('left').toggle();
        }

        //Run this right away and build timeline
        self.init(self.lengthOfPeriodInSeconds);

    }

})(window.angular);
