
function Task(name, period, execTime) {
    this.name = name;
    this.period = period;
    this.execTime = execTime;
    this.execution = []; // x: executing, r: ready/waiting, i: idle
}

Task.prototype.isBusy(step) {
    if (step < this.execution.length && this.execution[step] == 'x') {
        return true;
    }
    return false;
}

Task.prototype.createTableRow = function(hyperPeriod) {
    var row = '<td></td>';
    for (var timeStep = 0;timeStep < hyperPeriod;timeStep++) {
        if (timeStep < this.execution.length && this.execution[timeStep] == 'x') {
            row += '<td class="executing"></td>';
        } else if (timeStep < this.execution.length && this.execution[timeStep] == 'r') {
            row += '<td class="idle"></td>';
        } else {
            row += '<td></td>';
        }
    }
    return row;
}

function gcd(a,b) {
    if (a == b) { return a; }
    else if (a > b) { return gcd(a-b,b); }
    else { return gcd(a,b-a); }
}

function lcm(a,b,gcd) {
    return (a * b) / gcd;
}

function TimingDiagram(name,div) {
    this.div = div;
    this.period = 0;
    this.hyperPeriod = 1;
    this.tasks = [];
}

TimingDiagram.prototype.addTask = function(newTask) {
    this.tasks.push(newTask);
    if (this.tasks.length == 1) {
        this.period = newTask.period;
        this.hyperPeriod = newTask.period;
    } else {
        /* Calculating the new system period */
        this.period = gcd(this.period,newTask.period);
        /* Calcualting the new hyper period */
        this.hyperPeriod = lcm(this.hyperPeriod,newTask.period,this.period);
    }
}

TimingDiagram.prototype.print = function () {
    var par = '<p>Period: '+this.period+'<br>';
    par += 'Hyper Period: '+this.hyperPeriod+'<br>';
    par += '<ul>';
    for (i in this.tasks) {
        var currentTask = this.tasks[i];
        par += '<li>'+currentTask.name+': ('+currentTask.period+','+currentTask.execTime+')</li>';
    }
    par += '</ul></p>';
    this.div.append(par);
}

TimingDiagram.prototype.timeSteps = function() {
    /* Set up the time steps */
    var emptyTime;
    for (var i = 1;i < this.period;i++) {
        emptyTime += '<th></th>';
    }
    var timeSteps = $('<tr></tr>').addClass('timingDiagramSteps');
    timeSteps.append('<th></th>');
    for (var step = 0;step<=this.hyperPeriod;step+=this.period) {
        var column = '<th>'+step+'</th>';
        timeSteps.append(column);
        timeSteps.append(emptyTime);
    }
    return timeSteps;
}

TimingDiagram.prototype.display = function() {
    var table = $('<table></table>').addClass('timingDiagram');//.addId(name+'Table');
    table.append('<caption>Timing Diagram</caption>');
    /* Set up each task */
    /* TODO: Redo this using the execute function. CreateTableRow will be changed to be called after
    for (task in this.tasks) {
        var row = this.tasks[task].createTableRow(this.period,this.hyperPeriod);
        table.append(row);
    }*/

    table.append(this.timeSteps());

    this.div.append('<p>Period: '+this.period+'<br>Hyper Period: '+this.hyperPeriod+'</p>');
    this.div.append(table);
}

TimingDiagram.prototype.nonPreemptive = function() {
    var table = $('<table></table>').addClass('timingDiagram');//.addId(name+'Table');
    table.append('<caption>Timing Diagram (Non-preemptive)</caption>');

    var busy = false;
    var ready = [];
    var executing = [];
    for (var timeStep = 0;timeStep < this.hyperPeriod;timeStep+=this.period) {
        busy = false;
        /* Is the processor still busy? */
        for (task in executing) {
            if (executing[task].isBusy(timeStep)) {
                busy = true;
            } else {
                executing.splice(task,1);
            }
        }
        /* Determine which tasks are ready to execute */
        for (task in this.tasks) {
            if (!busy && this.tasks[task].isReady(timeStep)) {
                this.tasks[task].execute(timeStep);
                busy = true;
            }
        }
    }

    this.div.append('<p>Period: '+this.period+'<br>Hyper Period: '+this.hyperPeriod+'</p>');
    this.div.append(table);
}

