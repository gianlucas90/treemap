// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 1000 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;

var legMargin = { top: 20, right: 20, bottom: 20, left: 20 },
  legWidth = 700 - legMargin.left - legMargin.right,
  legHeight = 250 - legMargin.top - legMargin.bottom,
  legOffset = 20;

// colors
var colorArray = [
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#33FFCC',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#991AFF',
];
// append the svg object to the body of the page
var svg = d3
  .select('#graph')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var legend = d3
  .select('#legend')
  .attr('width', legWidth + legMargin.left + legMargin.right)
  .attr('height', legHeight + legMargin.top + legMargin.bottom);

// read json data
d3.json(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'
).then((data) => {
  // Give the data to this cluster layout:
  var root = d3.hierarchy(data).sum(function (d) {
    return d.value;
  }); // Here the size of each leave is given in the 'value' field in input data

  // Set colors based on groups
  root.data.children.forEach(function (child, i) {
    child.color = colorArray[i];
  });

  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap().size([width, height]).padding(2)(root);

  // use this information to add rectangles:
  const tile = svg
    .selectAll('rect')
    .data(root.leaves())
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return d.x0;
    })
    .attr('y', function (d) {
      return d.y0;
    })
    .attr('width', function (d) {
      return d.x1 - d.x0;
    })
    .attr('height', function (d) {
      return d.y1 - d.y0;
    })
    .style('stroke', 'black')
    .attr('class', 'tile')
    .attr('data-name', (d) => d.data.name)
    .attr('data-category', (d) => d.data.category)
    .attr('data-value', (d) => d.data.value)
    .style('fill', (d) => d.parent.data.color);

  // and to add the text labels
  const labels = svg
    .selectAll('foreignObject')
    .data(root.leaves())
    .enter()
    .append('foreignObject')
    .attr('x', function (d) {
      return d.x0 + 5;
    }) // +10 to adjust position (more right)
    .attr('y', function (d) {
      return d.y0 + 5;
    }) // +20 to adjust position (lower)
    .attr('width', function (d) {
      return d.x1 - d.x0 - 8;
    })
    .attr('height', function (d) {
      return d.y1 - d.y0 - 10;
    });

  labels
    .append('xhtml:body')
    .style('font-size', '9px')
    .html(function (d) {
      return d.data.name;
    });

  tile
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);

  labels
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);

  // Legend
  legend
    .selectAll('rect')
    .data(root.data.children)
    .enter()
    .append('rect')
    .attr('x', function (d, i) {
      if (i < 5) return i * 140;
      if (i < 10) return (i - 5) * 140;
      if (i < 15) return (i - 10) * 140;
      if (i < 20) return (i - 15) * 140;
    })
    .attr('y', function (d, i) {
      if (i < 5) return 0 + legOffset;
      if (i < 10) return 50 + legOffset;
      if (i < 15) return 100 + legOffset;
      if (i < 20) return 150 + legOffset;
    })
    .attr('width', 10)
    .attr('height', 10)
    .attr('class', 'legend-item')
    .attr('fill', (d) => d.color);

  // Legend Text
  legend
    .selectAll('text')
    .data(root.data.children)
    .enter()
    .append('text')
    .attr('x', function (d, i) {
      if (i < 5) return i * 140 + 18;
      if (i < 10) return (i - 5) * 140 + 18;
      if (i < 15) return (i - 10) * 140 + 18;
      if (i < 20) return (i - 15) * 140 + 18;
    })
    .attr('y', function (d, i) {
      if (i < 5) return 0 + 10 + legOffset;
      if (i < 10) return 50 + 10 + legOffset;
      if (i < 15) return 100 + 10 + legOffset;
      if (i < 20) return 150 + 10 + legOffset;
    })
    .text(function (d) {
      return d.name;
    });

  // Tooltip
  var div = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('display', 'none');

  function mouseover() {
    div.style('display', 'inline');
  }

  function mousemove(event, d) {
    let [x, y] = d3.pointer(event);
    let info = d;

    // console.log(d);

    div

      .text('$' + info.data.value)
      .attr('data-value', info.data.value)
      .style('left', x + 220 + 'px')
      .style('top', y + 70 + 'px');
  }

  function mouseout() {
    div.style('display', 'none');
  }
});
