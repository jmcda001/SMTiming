
function initialize() {
    var exampleSM = new StateMachine('Example',$('#stateMachineDiv')); // (name, div)
    exampleSM.addState('s1',['']);// (name,[actions])
    exampleSM.addState('s2',['']);// (name,[actions])
    exampleSM.addState('s3',['']);// (name,[actions])
    exampleSM.setInitial('s1'); // (name,[actions]*) actions are optional
    exampleSM.addTransition('s1','s2'); // (sourceName, sinkName, [actions]*) actions are optional
    exampleSM.addTransition('s2','s3'); // (sourceName, sinkName, [actions]*) actions are optional
    exampleSM.addTransition('s3','s1'); // (sourceName, sinkName, [actions]*) actions are optional

    //exampleSM.print();
}

$(window).on('load',initialize);
