FamousFramework.scene('game:hint', {
    behaviors: {
        '#question-mark': {
            'content': '<img src="{{@CDN_PATH}}question-mark.png" width=50 height=50>',
            'size': [50, 50],
            'align':[0.9,0.9],
            'style': {
                'background-color': 'black',
                'box-shadow':'0 0 50px rgba(0,0,0,0.8)',
            }
        }
    },
    events: {
        '#question-mark': {
            'click': function($dispatcher){
                $dispatcher.emit('hint');
            }
        }
    },
    tree: '<node id="question-mark"></node>'
});
