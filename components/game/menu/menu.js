FamousFramework.scene('game:menu', {
    behaviors: {
        '#menu': {
            'content': '<h1>Famous Memory Game</h1>',
            'size': [600, 300],
            'opacity': 0.8,
            'align':[0.5,0.5],
            'mount-point':[0.5,0.5],
            'origin':[0.5,0.5],
            'position-z': 500,
            'style': {
                'border':'5px solid white',
                'border-radius':'50%',
                'text-align':'center',
                'padding-top': '10px',
                'color':'white',
                'box-shadow':'0 0 50px rgba(0,0,0,0.8)',
                'background': 'linear-gradient(to bottom,  rgba(0,0,0,1) 20%,rgba(0,0,0,0.7) 100%)'
            }
        },
        '#start-button':{
            'content': 'Start',
            'size': [200,50],
            'position-z': 600,
            'align': [0.5,0.35],
            'origin': [0.5,0.5],
            'mount-point': [0.5,0.5],
            'style': {
                'background-color': 'blue',
                'border':'3px solid white',
                'font-size':'30px',
                'text-align':'center',
                'padding-top': '5px',
                'cursor':'pointer'
            }
        },
        '#options-button':{
            'content': 'Options',
            'size': [200,50],
            'position-z': 600,
            'align': [0.5,0.55],
            'origin': [0.5,0.5],
            'mount-point': [0.5,0.5],
            'style': {
                'background-color': 'blue',
                'border':'3px solid white',
                'font-size':'30px',
                'text-align':'center',
                'padding-top': '5px',
                'cursor':'pointer'
            }
        },
        '#exit-button':{
            'content': 'Exit',
            'size': [200,50],
            'position-z': 600,
            'align': [0.5,0.75],
            'origin': [0.5,0.5],
            'mount-point': [0.5,0.5],
            'style': {
                'background-color': 'blue',
                'border':'3px solid white',
                'font-size':'30px',
                'text-align':'center',
                'padding-top': '5px',
                'cursor':'pointer'
            }
        },
    },
    events: {
        '$lifecycle': {
            'post-load': function($timelines){
                $timelines.get('fade-in').start({ duration: 1000 });
            }
        },
        '$public': {
            'start': function($dispatcher){
                $dispatcher.emit('start');
            }
        },
        '#start-button': {
            'click': function($timelines, $dispatcher){
                $timelines.get('fade-out').start({duration: 500});
                $dispatcher.trigger('start');
            }
        }
    },
    states: {
        showMenu : true
    },
    tree: 'menu.html'
})
.timelines({
    'fade-in' : { 
        '#menu': {
            'selectable': {
                '0%': { value: true }
            },
            'position-y': {
                '0%:': {value: -2000},
                '80%': {value: 0}
            },
            'rotation-z': {
                '0%': {value: 0},
                '80%': {value: Math.PI/32},
                '90%': {value: -Math.PI/64},
                '100%': {value: 0}
            },
            'opacity': {
                '70%': {value: 0, curve: 'outCirc'},
                '100%': {value: 0.8, curve: 'outCirc'}
            },
        }
    },
    'fade-out' : { 
        '#menu': {
            'opacity': {
                '0%': {value: 0.8, curve: 'outCirc'},
                '90%': {value: 0, curve: 'outCirc'}
            },
            'position-y': {
                '90%:': {value: 0},
                '100%': {value: -2000}
            },
            'selectable': {
                '0%': { value: false }
            }
        }
    },
});
