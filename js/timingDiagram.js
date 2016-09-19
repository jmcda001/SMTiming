function Task(name, period, execTime) {
    this.name = name;
    this.period = period;
    this.execTime = execTime;
}

// Returns true only if the time step is a multiple of the period. i.e. the task is immediately ready
Task.prototype.isReady = function(step) {
    if (step % this.period == 0) {
        return true;
    }
    return false;
}

Task.prototype.miss = function(step) { 
    var missed = '';
    for (var i = 0;i < this.execTime;i++) { 
        missed += '<td class="missed"></td>';
    }
    return missed;
}

Task.prototype.idle = function() {
    return $('<td></td>').addClass('idle');
}

Task.prototype.wait = function() {
    return $('<td></td>').addClass('wait');
}

Task.prototype.execute = function() {
    var execute = [];
    for (var i = 0;i < this.execTime;i++) {
        execute.push($('<td></td>').addClass('executing'));
    }
    return execute;
}

function gcd(a,b) {
    if (a == b) { return a; }
    else if (a > b) { return gcd(a-b,b); }
    else { return gcd(a,b-a); }
}

function lcm(a,b) {
    return (a * b) / gcd(a,b);
}

function TimingDiagram(name) {
    this.name = name;
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
        /* Calculating the new hyper period */
        this.hyperPeriod = lcm(this.hyperPeriod,newTask.period);
    }
}

TimingDiagram.prototype.generateSummary = function () {
    var summaryPar = $('<p></p>').attr('id',this.name+'SummaryPar');
    summaryPar.html('Period: '+this.period+'<br>'+'Hyper Period: '+this.hyperPeriod);

    var tasks = $('<ul></ul>');
    for (i in this.tasks) {
        var taskSummary = this.tasks[i].name+': ('+this.tasks[i].period+','+this.tasks[i].execTime+')';
        var currentTask = $('<li></li>').text(taskSummary);
        tasks.append(currentTask);
    }
    summaryPar.append(tasks);
    return summaryPar;
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

TimingDiagram.prototype.setupTaskRows = function() {
    var taskRows = [];
    for (task in this.tasks) {
        var taskRow = [];
        taskRow.push($('<td></td>').text(this.tasks[task].name));
        taskRows.push(taskRow);
    }
    return taskRows;
}

TimingDiagram.prototype.addTaskRows = function(taskRows,table) {
    for (var i = 0;i < taskRows.length;i++) {
        var currentRow = taskRows[i];
        var row = $('<tr></tr>');
        for (var j = 0;j < currentRow.length;j++) {
            var currentClass = currentRow[j].attr('class');
            var toMerge = 0;
            for (var k = j;k < currentRow.length;k++) {
                if (currentRow[k].attr('class') == currentClass) { 
                    toMerge++;
                } else {
                    break;
                }
            }
            currentRow[j].attr('colspan',toMerge);
            currentRow.splice(j+1,toMerge-1);
            row.append(currentRow[j]);
        }
        table.append(row);
    }
}

TimingDiagram.prototype.generateTimingDiagram = function() {
    var table = $('<table></table>').addClass('timingDiagram');
    table.attr('id',this.name+'Table');
    table.append('<caption>Timing Diagram</caption>');
    var taskRows = this.setupTaskRows();
    for (var step = 0;step < this.hyperPeriod;step++) { 
        for (task in this.tasks) {
            if (this.tasks[task].isReady(step)) {
                taskRows[task] = taskRows[task].concat(this.tasks[task].execute());
            } else if (taskRows[task].length <= step+1) {
                taskRows[task].push(this.tasks[task].idle());
            }
        }
    }

    this.addTaskRows(taskRows,table);
    table.append(this.timeSteps());

    return table;
}

TimingDiagram.prototype.generateNonpreemptiveSchedule = function() {
    var table = $('<table></table>').addClass('timingDiagram');
    table.attr('id','nonpreemptive'+this.name);
    table.append('<caption>Timing Diagram (Non-preemptive)</caption>');

    var busy = 0;
    var waiting = [];
    var taskRows = this.setupTaskRows();
    for (var timeStep = 0;timeStep < this.hyperPeriod;timeStep++) {
        //debugger;
        for (var waitTask = 0;waitTask < waiting.length;waitTask++) {
            var task = waiting[waitTask];
            if (busy == 0) {
                taskRows[task] = taskRows[task].concat(this.tasks[task].execute());
                waiting.splice(waitTask,1); // Removes the waiting task
                busy = this.tasks[task].execTime;
                waitTask--;
            } else if (taskRows[task].length <= timeStep+busy+1) {
                taskRows[task] = taskRows[task].concat(this.tasks[task].wait());
            }
        }
        for (task in this.tasks) {
            if (this.tasks[task].isReady(timeStep)) {
                if (busy == 0) {
                    taskRows[task] = taskRows[task].concat(this.tasks[task].execute());
                    busy = this.tasks[task].execTime;
                } else if (taskRows[task].length <= timeStep+1) {
                    waiting.push(task);
                    taskRows[task] = taskRows[task].concat(this.tasks[task].wait());
                }
            } else if (taskRows[task].length <= timeStep+1) {
                taskRows[task].push(this.tasks[task].idle());
            }
        }
        busy = busy > 0?busy-1:0;
    }

    this.addTaskRows(taskRows,table);
    table.append(this.timeSteps());

    return table;
}

TimingDiagram.prototype.clear = function() {
    $('#'+this.name+'Table').remove();
    $('#nonpreemptive'+this.name).remove();
    $('#'+this.name+'SummaryPar').remove();
}
