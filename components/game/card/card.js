var easyDeck = {
    1 : 'ape',      2 : 'ape',
    3 : 'cat',      4 : 'cat',
    5 : 'dino',     6 : 'dino',
    7 : 'dino',     8 : 'dino',
    9 : 'frog',     10 : 'frog',
    11 : 'ape',     12 : 'ape',
    13 : 'dino',    14 : 'dino',
    15 : 'frog',    16 : 'frog',
    17 : 'cat',     18 : 'cat'
}

var difficultDeck = {
    1 : 'ape',      2 : 'ape',
    3 : 'cat',      4 : 'cat',
    5 : 'dino',     6 : 'dino',
    7 : 'face',     8 : 'face',
    9 : 'frog',     10 : 'frog',
    11 : 'house',   12: 'house',
    13 : 'm',       14 : 'm',
    15 : 'x',       16 : 'x',
    17 : 'yoda',    18 : 'yoda'
}

FamousFramework.scene('game:card', {
    behaviors: {

        '#card': {
            'content': function(isSelected, card){
                if(isSelected){
                    return '<img src="{{@CDN_PATH}}cards/card-' + easyDeck[card] + '.png" width=100 height=140>';
                }
                else {
                    return '<img src="{{@CDN_PATH}}/cards/card-back.png" width=100 height=140>';
                }
            },
            'size': [100, 140],
            'position-z':1,
            'origin': [0.5,0.5],
            'selected': function(isSelected){
                return isSelected;
            },
            'matched': function(isMatched){
                return isMatched;
            }
        }
    },

    events: {

        '$lifecycle': {
            'post-load': function($dispatcher){
                $dispatcher.trigger('deal', 2000 + (Math.random() * 2000));
            }
        },

        '#card':{
            'click': function($state, $dispatcher){
                if(!$state.get('isMatched')){
                    $dispatcher.trigger('flipUp');
                }
            },
            'reset': function($dispatcher, $state, $payload){
                console.log("Reset called");
                if($state.get('isReset') && $state.get('isSelected') && !$state.get('isMatched')){
                    $state.set('isReset',false);
                    $dispatcher.trigger('flipDown');
                }
            }, 
            'mouseover': function($state, $timelines){
                if(!$state.get('isSelected')){
                    $timelines.get('wobble').start({duration: 400});
                }
            }
        },

        '$public': {

            'card':'[[setter]]',
            'isSelected':'[[setter]]',
            'isMatched':'[[setter]]',

            'flipUp': function($timelines, $state, $dispatcher){
                if(!$state.get('isMatched')){
                    $timelines.queue([ 
                        ['pre-flip', { duration: 200 }, ()=> {
                            $state.set('isSelected', true),
                            $dispatcher.emit("selected", {
                                card: easyDeck[$state.get('card')]
                            });
                        }],
                        ['post-flip', { duration: 200 }]
                    ], function(){ }).startQueue();
                }
            },
            'flipDown': function($timelines, $state){
                if(!$state.get('isMatched' && $state.get('isSelected'))){
                    $timelines.queue([
                        ['delay', { duration: 1000 }],    
                        ['pre-flip', { duration: 300 }, ()=> {
                            $state.set('isSelected', false)
                        }],
                        ['post-flip', { duration: 300 }]
                    ], function(){
                        $state.set('isReset', true);
                    }).startQueue();
                }
            },
            'deal': function($timelines, $payload){
                $timelines.get('deal').start({duration: $payload});
            },
         },
    },

    states: {
        card: 1,
        isSelected: false,
        isMatched: false,
        isReset: true,
        resetDelay: 2000
    },

    tree: '<node id="card"></node>'
})
.timelines({
    'delay' : { 
        '#card': {
            'size-x': {
                '0%': {value: 100},
                '50%': {value: 120},
                '100%': {value: 100}
            },
            'size-y': {
                '0%': {value: 140},
                '50%': {value: 160},
                '100%': {value: 140}
            }
        }
    },
    'pre-flip': {
        '#card': {
            'rotation-y': {
                '0%': {value: 0, curve: 'outCirc'},
                '100%': {value: Math.PI/2, curve: 'outCirc'}
            },
        }
    },
    'post-flip':{
        '#card': {
            'rotation-y': {
                // '0%': {value: Math.PI/2.1, curve: 'linear'}, // TODO: Problem with animation here, reseting to this value
                '100%': {value: 0, curve: 'inCirc'}
            },
            'rotation-z': {
                '0%': {value: 0}
            }
        }
    },
    'wobble':{
        '#card': {
            'rotation-z': {
                '0%': {value: 0, curve: 'linear'}, 
                '25%': {value: Math.PI/32, curve: 'linear'}, 
                '50%': {value: 0, curve: 'linear'}, 
                '75%': {value: -Math.PI/32, curve: 'linear'}, 
                '100%': {value: 0, curve: 'inCirc'}
            }
        }
    },
    'deal':{
        '#card': {
            'position-y': {
                '50%': { value: 1000, curve: 'inOutQuad'},
                '100%': { value: 0, curve: 'inOutQuad'}
            },
            'rotation-z': {
                '50%': { value: (Math.random() < 0.5 ? -1 : 1) * 3 * Math.PI + (Math.PI * Math.ceil(Math.random() * 3))},
                '100%': { value: 0, curve: 'inOutQuad'}
            }
        }
    }
});
