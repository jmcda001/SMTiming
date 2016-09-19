var system;

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
    system = new TimingDiagram('Example',$('#timingDiv'));

    system.addTask(new Task('T1',10,4));
    system.addTask(new Task('T2',15,4));
    system.addTask(new Task('T3',20,4));

    generateTimingDiagram();
    generateNonpreemptiveSchedule();
}

function addTask() {
    var name = $('#taskName')[0].value;
    var period = $('#taskPeriod')[0].value;
    var execTime = $('#taskExecTime')[0].value;

    if (!system) {
        system = new TimingDiagram('',$('#timingDiv'));
    }

    system.addTask(new Task(name,period,execTime));
    system.clear();
    $('#summary').append(system.generateSummary());
}

function generateTimingDiagram() {
    if (!system) { return; }
    $('#timingDiagram').prepend(system.generateTimingDiagram());
}

function generateNonpreemptiveSchedule() {
    if (!system) { return; }
    $('#nonpreemptiveSchedule').prepend(system.generateNonpreemptiveSchedule());
}

function initialize() {
    $('#addTaskButton').on('click',addTask);
    $('#generateTimingDiagram').on('click',generateTimingDiagram);
    $('#generateNonpreemptiveScheduling').on('click',generateNonpreemptiveSchedule);
    //testSM();
    testTiming();
}

$(window).on('load',initialize);
