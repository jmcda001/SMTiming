
function Task(name, period, execTime) {
    this.name = name;
    this.period = period;
    this.execTime = execTime;
}

Task.prototype.createTableRow = function(period,hyperPeriod) {
    var idle = this.period - this.execTime
    var empty = '<td colspan="'+idle+'"></td>';
    var exec = '<td colspan="'+this.execTime+'" class="executing"></td>';

    var row = '<tr><td>'+this.name+'</td><td colspan="'+this.period+'"></td>';
    for (var i = 0;i < hyperPeriod;i += this.period) {
        row += exec + empty;
    }
    row += '</tr>';
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
    for (task in this.tasks) {
        var row = this.tasks[task].createTableRow(this.period,this.hyperPeriod);
        table.append(row);
    }

    table.append(this.timeSteps());

    this.div.append('<p>Period: '+this.period+'<br>Hyper Period: '+this.hyperPeriod+'</p>');
    this.div.append(table);
}

TimingDiagram.prototype.nonPreemptive = function() {
    var table = $('<table></table>').addClass('timingDiagram');//.addId(name+'Table');
    table.append('<caption>Timing Diagram</caption>');




    this.div.append('<p>Period: '+this.period+'<br>Hyper Period: '+this.hyperPeriod+'</p>');
    this.div.append(table);
}
