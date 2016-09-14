function testSM() {
    var exampleSM = new StateMachine('Example',$('#stateMachineDiv')); // (name, div)

    //debugger;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvas = $('#stateMachineDiv canvas')[0];
    canvas.width = width;
    canvas.height = height;
    //$('#stateMachineDiv canvas')[0].width = window.innerWidth;
    //$('#stateMachineDiv canvas')[0].height = window.innerHeight;

    exampleSM.addState('s1',['']);// (name,[actions])
    exampleSM.addState('s2',['']);// (name,[actions])
    exampleSM.addState('s3',['']);// (name,[actions])
    exampleSM.setInitial('s1'); // (name,[actions]*) actions are optional
    exampleSM.addTransition('s1','s2'); // (sourceName, sinkName, [actions]*) actions are optional
    exampleSM.addTransition('s2','s3'); // (sourceName, sinkName, [actions]*) actions are optional
    exampleSM.addTransition('s3','s1'); // (sourceName, sinkName, [actions]*) actions are optional

    //exampleSM.print();
}

function testTiming() {
    var exampleTiming = new TimingDiagram('Example',$('#timingDiv'));

    exampleTiming.addTask(new Task('T1',10,4));
    exampleTiming.addTask(new Task('T2',15,4));

    exampleTiming.print();
    exampleTiming.display();
}

function initialize() {
    //testSM();
    testTiming();
}

$(window).on('load',initialize);
