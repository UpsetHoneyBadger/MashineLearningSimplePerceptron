var g
var update = (data) => {
    var t = d3.transition()
      .duration(750);

    var dots = g.selectAll("circle")
        .data(data)

    dots
    .attr("class", "update")
    .transition(t)
    .attr("cx", function (d, i) {
        return x(d.x);
    })
    .attr("cy", function (d) {
        return y(d.y);
    })

    dots.enter().append("svg:circle")
    .attr("cx", function (d, i) {
        return width /2;
    })
    .attr("cy", function (d) {
        return height / 2;
    })
    .transition()
    .duration(2000)
    .attr("cx", function (d, i) {
        return x(d.x);
    })
    .attr("cy", function (d) {
        return y(d.y);
    })
    .attr('class', d => d.side ? 'aboveLine' : 'belowLine')
    .attr("r", 3)

    dots.exit().remove()
}

var drawHeatmap = (data) => {
    var rects = g.selectAll("rect")
    .data(data)

    rects
    .attr("x", function (d, i) {
        return x(d.px);
    })
    .attr("y", function (d) {
        return y(d.py);
    })
    .style("fill", d => getGradientColor('#FF0000', '#00FF00', d.probability))
    .style("opacity", 0.3)

    rects.enter().append("svg:rect")
    .attr("x", function (d, i) {
        return x(d.px);
    })
    .attr("y", function (d) {
        return y(d.py);
    })
    .attr("width", width/RESOLUTION - 1 )
    .attr("height", height/RESOLUTION - 1 )
    .style("fill", d => getGradientColor('#FF0000', '#00FF00', d.probability))
    .style("opacity", 0.3)

    rects.exit().remove()
}

var margin = {
        top: 20,
        right: 15,
        bottom: 60,
        left: 60
    }
width = 500 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, 1])
    .range([height, 0]);

var chart = d3.select('div.chartContainer')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')

var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main')

// draw the x axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

main.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'main axis date')
    .call(xAxis);

// draw the y axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

main.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'main axis date')
    .call(yAxis);

g = main.append("svg:g");


getGradientColor = function(start_color, end_color, percent) { 
    // strip the leading # if it's there
    start_color = start_color.replace(/^\s*#|\s*$/g, '');
    end_color = end_color.replace(/^\s*#|\s*$/g, '');
 
    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(start_color.length == 3){
      start_color = start_color.replace(/(.)/g, '$1$1');
    }
 
    if(end_color.length == 3){
      end_color = end_color.replace(/(.)/g, '$1$1');
    }
 
    // get colors
    var start_red = parseInt(start_color.substr(0, 2), 16),
        start_green = parseInt(start_color.substr(2, 2), 16),
        start_blue = parseInt(start_color.substr(4, 2), 16);
 
    var end_red = parseInt(end_color.substr(0, 2), 16),
        end_green = parseInt(end_color.substr(2, 2), 16),
        end_blue = parseInt(end_color.substr(4, 2), 16);
 
    // calculate new color
    var diff_red = end_red - start_red;
    var diff_green = end_green - start_green;
    var diff_blue = end_blue - start_blue;
 
    diff_red = ( (diff_red * percent) + start_red ).toString(16).split('.')[0];
    diff_green = ( (diff_green * percent) + start_green ).toString(16).split('.')[0];
    diff_blue = ( (diff_blue * percent) + start_blue ).toString(16).split('.')[0];
 
    // ensure 2 digits by color
    if( diff_red.length == 1 ) diff_red = '0' + diff_red
    if( diff_green.length == 1 ) diff_green = '0' + diff_green
    if( diff_blue.length == 1 ) diff_blue = '0' + diff_blue
 
    return '#' + diff_red + diff_green + diff_blue;
  };