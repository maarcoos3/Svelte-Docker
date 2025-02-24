<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    let data = [];
    const width = 500, height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  
    onMount(async () => {
      // Cargar el CSV y convertir los tipos
      data = await d3.csv('/data/Titanic-Dataset.csv', d3.autoType);
      drawChart();
    });
  
    function drawChart() {
      // Limpiar el contenedor en caso de recarga
      d3.select('#embarkedchart').selectAll('svg').remove();
  
      const svg = d3.select('#embarkedchart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
  
      // Calcular el número de pasajeros por puerto de embarque
      const counts = d3.rollups(
        data,
        v => v.length,
        d => d.Embarked
      );
  
      // Filtrar solo para los puertos 
      const filtered = counts.filter(d => ['C', 'Q', 'S'].includes(d[0]));
  
      // Escala para el eje X (categorías)
      const xScale = d3.scaleBand()
        .domain(filtered.map(d => d[0]))
        .range([margin.left, width - margin.right])
        .padding(0.1);
  
      // Escala para el eje Y (cuentas)
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(filtered, d => d[1])])
        .range([height - margin.bottom, margin.top]);
  
      // Eje X
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('fill', 'black')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Puerto de embarque');
  
      // Eje Y
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .text('Cantidad de pasajeros');
  
      // Dibujar las barras
      svg.selectAll('.bar')
        .data(filtered)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d[0]))
        .attr('y', d => yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - margin.bottom - yScale(d[1]))
        .attr('fill', 'orange');
  
      // Añadir leyenda para los puertos de embarque
      const legendData = [
        { code: 'C', name: 'Cherburgo' },
        { code: 'Q', name: 'Queenstown' },
        { code: 'S', name: 'Southampton' }
      ];
  
      const legend = svg.append('g')
        .attr('transform', `translate(${width - margin.right - 150}, ${margin.top})`);
  
      legend.selectAll('g')
        .data(legendData)
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`)
        .each(function(d) {
          const g = d3.select(this);
          g.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', 'orange');
          g.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(`${d.code}: ${d.name}`)
            .attr('font-size', '12px')
            .attr('fill', 'black');
        });
    }
  </script>
  
  <div id="embarkedchart"></div>
  