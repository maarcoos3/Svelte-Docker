<script>
  import { onMount, onDestroy } from 'svelte';
  import { dataTitanic, filters } from '../stores_titanic.js';
  import { select, scaleBand, scaleLinear, max, axisBottom, axisLeft, rollups, scaleOrdinal, scaleOrdinal as d3ScaleOrdinal } from 'd3';

  let rawData = [];
  let currentFilters = {};
  let unsubscribeData, unsubscribeFilters;

  const width = 600, height = 400;
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  unsubscribeData = dataTitanic.subscribe(data => {
    rawData = data;
    drawChart();
  });
  unsubscribeFilters = filters.subscribe(f => {
    currentFilters = f;
    drawChart();
  });

  function drawChart() {
    const container = document.getElementById('barchart');
    if (!container) return;
    container.innerHTML = '';

    const filteredData = rawData.filter(d => {
      const passSex = (currentFilters.male && d.Sex === 'male') ||
                      (currentFilters.female && d.Sex === 'female');
      const passClass = (currentFilters.class1 && d.Pclass === 1) ||
                        (currentFilters.class2 && d.Pclass === 2) ||
                        (currentFilters.class3 && d.Pclass === 3);
      const passPort = (currentFilters.pC && d.Embarked === 'C') ||
                       (currentFilters.pS && d.Embarked === 'S') ||
                       (currentFilters.pQ && d.Embarked === 'Q');
      return d.Age !== null && d.Survived !== null && passSex && passClass && passPort;
    });

    const grouped = rollups(
      filteredData,
      v => v.length,
      d => d.Pclass,
      d => d.Survived
    ).flatMap(([pclass, survMap]) => {
      return Array.from(survMap, ([surv, count]) => ({
        Pclass: +pclass,
        Survived: +surv,
        count
      }));
    });

    const classes = Array.from(new Set(grouped.map(d => d.Pclass))).sort((a, b) => a - b);
    const survStates = [0, 1];

    const x0 = scaleBand()
      .domain(classes)
      .range([margin.left, width - margin.right])
      .paddingInner(0.2);

    const x1 = scaleBand()
      .domain(survStates)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const yScale = scaleLinear()
      .domain([0, max(grouped, d => d.count) || 1]).nice() 
      .range([height - margin.bottom, margin.top]);

    const svg = select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Dibujar eje X
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(axisBottom(x0))
      .append('text')
      .attr('fill', 'black')
      .attr('x', (width - margin.left - margin.right) / 2 + margin.left)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text('Clase');

    // Dibujar eje Y
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(axisLeft(yScale))
      .append('text')
      .attr('fill', 'black')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .text('Cantidad de pasajeros');

    // Escala de color para supervivencia
    const color = d3ScaleOrdinal()
      .domain(survStates)
      .range(['tomato', 'seagreen']);

    // Dibujar las barras agrupadas
    const groups = svg.selectAll('.group')
      .data(classes)
      .enter()
      .append('g')
      .attr('class', 'group')
      .attr('transform', d => `translate(${x0(d)},0)`);

    groups.selectAll('rect')
      .data(d => survStates.map(s => {
        const found = grouped.find(g => g.Pclass === d && g.Survived === s);
        return { Survived: s, count: found ? found.count : 0 };
      }))
      .enter()
      .append('rect')
      .attr('x', d => x1(d.Survived))
      .attr('y', d => yScale(d.count))
      .attr('width', x1.bandwidth())
      .attr('height', d => height - margin.bottom - yScale(d.count))
      .attr('fill', d => color(d.Survived));

    // Añadir leyenda
    const legendData = [
      { label: 'No sobrevivió', color: color(0) },
      { label: 'Sobrevivió', color: color(1) }
    ];

    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right - 150}, ${margin.top})`);

    legend.selectAll('g')
      .data(legendData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)
      .each(function(d) {
        const g = select(this);
        g.append('rect')
          .attr('width', 15)
          .attr('height', 15)
          .attr('fill', d.color);
        g.append('text')
          .attr('x', 20)
          .attr('y', 12)
          .text(d.label)
          .attr('font-size', '12px')
          .attr('fill', 'black');
      });
  }

  onDestroy(() => {
    unsubscribeData();
    unsubscribeFilters();
  });
</script>

<div id="barchart"></div>
