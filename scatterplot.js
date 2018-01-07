const margin = { top: 20, right: 10, bottom: 40, left: 40 };

const width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const c = d3.select('#container').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// Various scales. These domains make assumptions of data, naturally.
const xScale = d3.scaleLog().domain([300, 1e5]).range([0, width]);
const yScale = d3.scaleLinear().domain([10, 85]).range([height, 0]);
const radiusScale = d3.scaleSqrt().domain([0, 5e8]).range([0, 40]);
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

c.append('g')
  .attr('class', 'x axis')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScale).ticks(12, d3.format(',d')));

c.append('g')
  .attr('class', 'y axis')
  .call(d3.axisLeft(yScale));

c.append('g').attr('class', 'circles');

let i = 0;

function update(nations) {
  // Update
  const circle = c.select('.circles')
    .selectAll('circle')
    .data(nations, d => d.name);

  // Enter
  const circleEnter = circle.enter().append('circle')
    .attr('stroke', 'rgba(0,0,0,0.5)')
    .attr('opacity', 0)
    .attr('cx', d => xScale(d.income[i]))
    .attr('cy', yScale(0))
    .attr('r', 0)
    .append('title')
    .text(d => d.name);

  // Enter + update
  c.selectAll('circle')
    .order((a, b) => a.population - b.population)
    .transition()
    .duration(1500)
    .attr('opacity', 1)
    .attr('cx', d => xScale(d.income[i]))
    .attr('cy', d => yScale(d.lifeExpectancy[i]))
    .attr('r', d => radiusScale(d.population[i]))
    .style('fill', d => colorScale(d.region));

  circle.exit().remove()
}

d3.json('nations.json', nations => {
  update(nations);

  document.querySelector('button').addEventListener('click', () => {
    i = 1 - i;
    update(nations);
  });

});
