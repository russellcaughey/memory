FamousFramework.scene('game:table', {
    behaviors: {

        '.container': {
            'unselectable': true,
            'style':{
                'background-color': 'black'
            }
        },

        '#table': {
            'content': '<img src="{{@CDN_PATH}}/table-top.jpg" width=900 height=550>',
            'opacity': function(gameOn){
                return gameOn ? 1 : 0.5;
            },
            'style': {
                'padding-left': '230px'
            }
        },

        '.card': {
            '$repeat': function(allCards) {
                var cardArray = [];
                var index = 0; 
                var randomNumbers = [];

                //Create a list of random numbers
                while(randomNumbers.length < 18){
                    var randomNum = Math.ceil(Math.random() * 18)
                    var found = false;
                    for(var i = 0; i < randomNumbers.length; i++){
                        if(randomNumbers[i] == randomNum){
                            found = true;
                            break
                        }
                    }
                    if(!found){
                        randomNumbers[randomNumbers.length] = randomNum;
                    }
                }

                // Create cards to place on the table
                for (var i = 0; i < 6; i++) {
                    for(var j = 0; j < 3; j++){
                        var x = (i * 100) + (i * 40) + 40;
                        var y = (j * 100) + (j * 60) + 50;
                        cardArray.push({
                            'position-x': x,
                            'position-y': y,
                            'position-z': 100,
                            'card':randomNumbers[index]
                        });
                        index++;
                    }
                }
                allCards = randomNumbers[index];
                return cardArray;
            },
        },
    },

    events: {

        '$lifecycle': {
            // Get a list of random numbers
            'post-load': function($dispatcher, $state){
                $dispatcher.trigger('resetSelectedCards');
            }
        },

        '$public': {

            'resetSelectedCards': function($state, $dispatcher){
                while($state.get('selectedCards').length > 0){
                    $state.get('selectedCards').pop();
                    $state.get('selectedIndexes').pop();
                }
                $state.set('matchSet', false);
            },
            'compareCards': function($state, $dispatcher, $payload, $index){

                var card1 = $state.get('selectedCards')[0];
                var card2 = $state.get('selectedCards')[1];

                if(card1 == card2){
                    $dispatcher.broadcast('setMatch'); 
                } else{
                    $dispatcher.broadcast('resetCards');
                }
                $dispatcher.trigger('resetSelectedCards');
            },
           'dealCards': function($dispatcher){
                $dispatcher.broadcast('deal');
            },
        },

        '.card': {
            'selected': function($payload, $state, $dispatcher, $index) {

                if($state.get('selectedCards').length < 2){
                    $state.get('selectedCards').push($payload.card);
                    $state.get('selectedIndexes').push($index);
                }
                
                if($state.get('selectedCards').length == 2){
                    $dispatcher.trigger('compareCards');
                }
            },
            'resetCards': function($state, $index, $dispatcher){
                if($index == $state.get('selectedIndexes')[0] || $index == $state.get('selectedIndexes')[1]){
                    $dispatcher.broadcast('reset', $state.get('selectedIndexes'));
                }
            },
            'setMatch': function($state, $dispatcher, $index){
                var currentMatches = $state.get('matchedCards');

                for(var i in currentMatches){
                    if (currentMatches[i] == $state.get('selectedIndexes')[0]) return;
                    if (currentMatches[i] == $state.get('selectedIndexes')[1]) return;
                }
                $state.get('matchedCards').push($state.get('selectedIndexes')[0]);
                $state.get('matchedCards').push($state.get('selectedIndexes')[1]);
                
                console.log("Matched list contains: " + $state.get('matchedCards'));
            },
            'checkCard': function($index, $state, $dispatcher){
                var currentMatches = $state.get('currentMatches');
                for(var i in currentMatches){
                    if (currentMatches[i] == $index){
                        $dispatcher.broadcast('matched', true);
                        return
                    }
                }
                $dispatcher.broadcast('matched', false);
            },
           'showHint': function($dispatcher){
                console.log("Showing hint...");
                $dispatcher.broadcast('hint');
            }
        },

        'game:menu': {
            'start': function($state, $dispatcher){
                $state.set('gameOn', true);
                $dispatcher.trigger('dealCards');
            }
        },
        'game:hint': {
            'hint': function($dispatcher){
                $dispatcher.trigger('showHint');
            }
        }
    },

    states: {
        gameOn: false,
        allCards:[],
        initCards: false,
        randomNumbers: [],
        matchedCards: [],
        matchSet: false,
        selectedCards: [],
        selectedIndexes: [],
    },

    tree: 'table.html'
})
.timelines({
    'deal':{
        'game:card': {
            'position-y': {
                '0%': { value: 1000 },
                '100%': { value: 0 }
            },
            'rotation-z': {
                '0%': { value: 2 * Math.PI },
                '100%': { value: 0 }
            }
        }
    }
});
