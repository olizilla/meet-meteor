
initSvg = function(){
  var $svg = $('svg');
  var $svgParent = $svg.parent();
  
  var width = $svgParent.width();
  var height = ($svgParent.width() / 2).toFixed(0);

  var dims = {width: width, height: height};
  $svg.attr(dims);

  return dims;
};

membersGraph = function(available){

  var svg = d3.select("#members-graph svg");

  var margin = {top: 20, right: 20, bottom: 50, left: 40};

  var graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var width = available.width - margin.left - margin.right;
  
  var height = available.height - margin.top - margin.bottom;
  console.log('Graph size:', width, height);

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

  var members = Members.find({}, { sort: [['joined', 'asc']]} ).fetch();

  var data = members.map(function(member, i){
    return {
      id: member.id,
      date: member.joined,
      count: i + 1
    };
  });

  x.domain([d3.min(data, function(d) { return d.date; }), Date.now()]);
  y.domain(d3.extent(data, function(d) { return d.count; }));

  graph.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  graph.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Members");

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
    .attr('title', function(d){return d.name })
    .attr('r', 4)
    .attr('cx', function(d){ console.log('x', x(d.date)); return x(d.date) } )
    .attr('cy', function(d){ console.log('y', y(d.count)); return y(d.count) } );

};
