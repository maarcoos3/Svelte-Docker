<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let data = [];

  onMount(async () => {
    // Carga el CSV desde la carpeta public/data (la ruta es relativa a public)
    data = await d3.csv('/data/Titanic-Dataset.csv', d3.autoType);
    console.log('Datos cargados:', data);
    drawChart();
  });

  function drawChart() {
    // Configuración de dimensiones y márgenes
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 600;
    const height = 400;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Eliminar cualquier gráfico previo (en caso de recargar el componente)
    d3.select('#chart').selectAll('svg').remove();

    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height
      );

    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Preparar los datos: contar por clase y supervivencia
    // Genera un array con objetos: { pclass, survived, count }
    const counts = d3.rollups(
      data,
      v => v.length,
      d => d.Pclass,
      d => d.Survived
    )
    .flatMap(([pclass, survMap]) => {
      return Array.from(survMap, ([surv, count]) => ({ pclass, survived: surv, count }));
    });

    // Extraer las clases y los estados de supervivencia (0 y 1)
    const classes = Array.from(new Set(counts.map(d => d.pclass))).sort();
    const survivalStates = [0, 1];  // 0 (no sobrevivió) y 1 (sobrevivió)

    // Escala para el grupo (Pclass)
    const x0 = d3.scaleBand()
      .domain(classes)
      .range([0, chartWidth])
      .paddingInner(0.2);

    // Escala para cada barra dentro del grupo
    const x1 = d3.scaleBand()
      .domain(survivalStates)
      .range([0, x0.bandwidth()])
      .padding(0.1);

    // Escala vertical para los conteos
    const y = d3.scaleLinear()
      .domain([0, d3.max(counts, d => d.count)]).nice()
      .range([chartHeight, 0]);

    // Escala de color para supervivencia
    const color = d3.scaleOrdinal()
      .domain(survivalStates)
      .range(['tomato', 'seagreen']);

    // Ejes
    chart.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x0))
      .append('text')
      .attr('fill', 'black')
      .attr('x', chartWidth / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text('Clase');

    chart.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('fill', 'black')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -chartHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Cantidad de pasajeros');

    // Agrupar datos por clase para facilitar la generación de grupos
    const grouped = d3.group(counts, d => d.pclass);

    // Dibujar las barras agrupadas
    grouped.forEach((values, pclass) => {
      chart.append('g')
        .attr('transform', `translate(${x0(pclass)},0)`)
        .selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('x', d => x1(d.survived))
        .attr('y', d => y(d.count))
        .attr('width', x1.bandwidth())
        .attr('height', d => chartHeight - y(d.count))
        .attr('fill', d => color(d.survived));
    });

    // Leyenda
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right - 100}, ${margin.top})`);

    survivalStates.forEach((state, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', color(state));

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(state === 1 ? 'Sobrevivió' : 'No sobrevivió')
        .attr('font-size', '12px')
        .attr('fill', 'black');
    });
  }
</script>

<div id="chart"></div>
