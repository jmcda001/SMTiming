/* StateMachine Class */
function StateMachine(name,SMDiv) {
    this.name = name;
    this.div = SMDiv;
    this.states = {};

    this.canvas = $('<canvas id="'+name+'Canvas"></canvas>')[0];
    SMDiv.append(this.canvas);
    this.canvas = new fabric.Canvas(this.canvas, { selection: false });

    this.period = 0;
    this.executionTime = 0;
    this.timing = new fabric.Text('Period: ',{
        top: 0,
        left: 0
    });
    this.canvas.add(this.timing);

    var initialRadius = 5;
    this.start = new fabric.Circle({
        top: this.timing.height,
        left: 0,
        fill: '#000',
        radius: initialRadius
    });
    this.canvas.add(this.start);
    this.currentX = 2*initialRadius;
    this.currentY = initialRadius + this.timing.height;
    this.currentRadius = initialRadius;
    this.tallestState = initialRadius;

}

// Parameters :
//  name: string
//  actions:  list of strings
//Adds a state of the given name with the given actions to the list of states
StateMachine.prototype.addState = function(name,actions) { 
    var newState = new State(name,actions);
    var rightEdge = this.currentX + (1.5*this.currentRadius) + newState.stateObject.width;
    if (rightEdge >= this.canvas.width) { 
        this.currentY += 1.5 * this.tallestState;
        this.tallestState = 0;
        this.currentX = 0; 
    }
    if (newState.stateObject.height > this.tallestState) { 
        this.tallestState = newState.stateObject.height; 
    }
    this.currentX += (1.5 * this.currentRadius);
    this.currentRadius = newState.stateObject.width;
    newState.shiftTo(this.currentX,this.currentY);
    this.states[name] = newState;
    this.canvas.add(newState.stateObject);
}

// Parameters :
//  source: string
//  sink: string
//  actions:  list of strings
//Adds a transition from the state of name 'source' to state of name 'sink'
//Adds actions to the transition
StateMachine.prototype.addTransition = function(source,sink,actions) { 
    sourceState = this.states[source];
    sinkState = this.states[sink];
    var transition = new Transition(sourceState,sinkState,actions);
    sourceState.addOutTransition(transition);
    sinkState.addInTransition(transition);
    this.canvas.add(transition.pathObject);
}

StateMachine.prototype.setInitial = function(name,actions=[]) {
    // TODO: Create an initialization transition with the give actions (state won't be displayed)
    this.initialState = this.states[name];
}

StateMachine.prototype.print = function() {
    var paragraph = '<p>';
    for(var state in this.states) {
        paragraph += this.states[state].getString();
    }
    paragraph += '</p>';
    this.div.append(paragraph);
}

/* State Class */
function State(name,actions=[]) {
    this.name = name;
    this.actions = actions;
    this.inTransitions = [];
    this.outTransitions = [];

    this.x = 0;
    this.y = 0;
    this.label = new fabric.Text(name, {
        top: this.y,
        left: this.x,
        stroke: '#000',
        fill: '#000',
    });

    this.radius = this.label.width;
    this.stateBoundary = new fabric.Circle({
        top: this.y - this.radius/2,
        left: this.x - this.radius/2,
        radius: this.radius,
        stroke: '#000',
        fill: '#fff',
    });

    this.stateObject = new fabric.Group([this.stateBoundary,this.label],{
        top: this.y,
        left: this.x
    });
}

State.prototype.shiftTo = function(newX,newY) {
    this.x = newX + this.stateObject.width / 2;
    this.y = newY + this.stateObject.height / 2;
    this.stateObject.setLeft(newX);
    this.stateObject.setTop(newY);
    this.stateObject.setCoords();
}

State.prototype.addInTransition = function(newTransition) {
    this.inTransitions.push(newTransition);
}

State.prototype.addOutTransition = function(newTransition) {
    this.outTransitions.push(newTransition);
}

State.prototype.getString = function() {
    var stateString = this.name + ': ' + this.actions + '</br>';
    stateString += '<ul>';
    for (var inT in this.inTransitions) {
        stateString += '<li>' + this.inTransitions[inT].source.name + '-><b>' + this.name + '</b>: ' + this.inTransitions[inT].actions + '</li>';
    }
    for (outT in this.outTransitions) {
        stateString += '<li><b>' + this.name + '</b>->' + this.outTransitions[outT].sink.name + ': ' + this.outTransitions[outT].actions + '</li>';
    }
    stateString += '</ul>';
    return stateString;
}

/* Transition Class */
function Transition(source,sink,actions) {
    this.source = source;
    this.sink = sink;
    this.actions = actions;

    var start = source.x + ',' + source.y;
    var end = sink.x + ' ' + sink.y;
    var midPointX = source.x == sink.x? source.x: (sink.x + source.x)/2;
    var midPointY = sink.y == source.y? source.y: (sink.y + source.y)/2;
    var midPoint = midPointX + ',' + midPointY;
    this.pathObject = new fabric.Path('M' + start + 'Q' + midPoint + ' ' + end,{
        fill: '',
        stroke: 'black',
    });
}
