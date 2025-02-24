<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    let data = [];
  
    onMount(async () => {
      // Carga el CSV desde la carpeta public/data
      data = await d3.csv('/public/data/Titanic-Dataset.csv');
      console.log('Datos cargados:', data);
      drawChart();
    });
  
    function drawChart() {
      // Selecciona el contenedor donde se dibujará el gráfico
      const svg = d3.select('#chart')
        .append('svg')
        .attr('width', 600)
        .attr('height', 400);
  
      // Ejemplo simple: contar la cantidad de pasajeros por clase
      const counts = d3.rollups(
        data,
        v => v.length,
        d => d.Pclass // Asegúrate de que este campo coincide con el nombre en el CSV
      );
  
      // Define escalas
      const xScale = d3.scaleBand()
        .domain(counts.map(d => d[0]))
        .range([50, 550])
        .padding(0.1);
  
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(counts, d => d[1])])
        .range([350, 50]);
  
      // Agregar barras
      svg.selectAll('.bar')
        .data(counts)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d[0]))
        .attr('y', d => yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => 350 - yScale(d[1]))
        .attr('fill', 'steelblue');
  
      // Agregar ejes (opcional)
      svg.append('g')
        .attr('transform', 'translate(0,350)')
        .call(d3.axisBottom(xScale));
  
      svg.append('g')
        .attr('transform', 'translate(50,0)')
        .call(d3.axisLeft(yScale));
    }
  </script>
  
  <div id="chart"></div>
  