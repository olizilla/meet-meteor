
// Create a sparkline of membership numbers over time
membersGraph = function(available){

  var members = Members.find({}, { sort: [['joined', 'asc']]} ).fetch();

  if (members.length < 1) { 
    return; // Abort!
  }  

  var data = members.map(function(member, i){
    return {
      id: member.id,
      date: member.joined,
      count: i + 1
    };
  });

  var svg = d3.select("#members-graph svg");
  svg.attr({
    width:available.width,
    height:available.height
  });

  console.log('Updating membership graph'/*, svg, members*/);

  var margin = {top: 10, right: 0, bottom: 0, left: 0};

  var graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var width = available.width - margin.left - margin.right;
  
  var height = available.height - margin.top - margin.bottom;

  var x = d3.time.scale().range([0, width]);
  x.tickFormat('%B');

  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.months, 1);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.count); });

  x.domain([d3.min(data, function(d) { return d.date; }), Date.now()]);
  y.domain(d3.extent(data, function(d) { return d.count; }));

  graph.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  var events = Events.find().fetch();

  var eventsData = events.map(function(d){
    var count = 0;

    members.forEach(function(m){
      if(m.joined < d.time){
        count = count + 1;
      }
    });

    return {
      id: d.id,
      date: d.time,
      count: count,
      name: d.name
    };
  });

  var eventsSelection = graph.selectAll('.event').data(eventsData);

  eventsSelection.enter()
    .append('circle')
    .attr('class', 'event')
    .attr('r', 2)
    .attr('cx', function(d){ return x(d.date); } )
    .attr('cy', function(d){ return y(d.count); } )
    .append('title')
    .text(function(d){return d.count + ' @ ' + d.name });
};
