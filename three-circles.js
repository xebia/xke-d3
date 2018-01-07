const datasets = [[
  { name: 'Mike', age: 20, tshirt: 'xl', bodylength: 180, gender: 'm' },
  { name: 'Frank', age: 42, tshirt: 's', bodylength: 154, gender: 'm' },
  { name: 'Eva', age: 7, tshirt: 'm', bodylength: 115, gender: 'f' }
], [
  { name: 'Frank', age: 46, tshirt: 'm', bodylength: 154, gender: 'm' },
  { name: 'Eva', age: 11, tshirt: 'xs', bodylength: 125, gender: 'f' },
  { name: 'Laura', age: 34, tshirt: 'l', bodylength: 167, gender: 'f' }
]];

// Add SVG
const svg = d3.select('#container').append('svg')
  .attr('width', 720)
  .attr('height', 120);

// Scales
const xScale = d3.scaleLinear().domain([0, 100]).range([0, 720]);
const yScale = d3.scaleLinear().domain([0, 200]).range([80, 20]);
const tshirtScale = d3.scaleOrdinal().domain(['xs', 's', 'm', 'l', 'xl']).range([1, 5]);
const radiusScale = d3.scaleSqrt().domain([1, 5]).range([5, 20]);
const colorScale = d3.scaleOrdinal(d3.schemePastel1).domain(['m', 'f']);

// Render
function update(data) {
  const circles = svg.selectAll('circle')
    // Update
    .data(data, d => d.name);

  // Exit
  circles.exit()
    .transition().duration(1500)
    .attr('r', 0)
    .remove();

  // Enter
  circles.enter().append('circle')
    .attr('r', 0)
    .style('fill', 'white')
      // Enter+update
      .merge(circles)
    .transition().duration(1500)
    .attr('r', d => radiusScale(tshirtScale(d.tshirt)))
    .attr('cy', d => yScale(d.bodylength))
    .attr('cx', d => xScale(d.age))
    .style('fill', d => colorScale(d.gender));
}

let i = 0;
update(datasets[i]);

document.querySelector('button').addEventListener('click', function () {
  // Switch datasets
  i = 1 - i;

  update(datasets[i]);
});
