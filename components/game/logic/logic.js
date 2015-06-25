var checkMatch = function($state){
    console.log("Called checkMatch");    
}

FamousFramework.scene('game:logic', {
    events: {
        '$public': {
            'game-start': function($dispatcher){
                console.log("Game starting...")
            },
            'check': function($payload, $state){
                console.log("Logic received message from table");
            }
        },
        '$lifecycle': {
            'post-load': function($dispatcher, $state){
                // $dispatcher.trigger('game-start');
            }
        }
        // 'game:table': {
        //     'check': function($payload, $state){
        //         console.log("Logic received message from table");
        //     }
        // }
    },
    states: {
        numMatches: 0
    }
});
