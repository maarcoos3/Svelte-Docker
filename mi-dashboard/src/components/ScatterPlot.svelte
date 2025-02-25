<script>
    import { onDestroy } from 'svelte';
    import { dataBySurvivingBySex } from '../stores_titanic.js';
    import { select, scaleLinear, scalePoint, axisBottom, axisLeft } from 'd3';
    import * as d3 from 'd3';
  
    let chartData = null;
    let unsubscribe;
  
    // Suscribirse al store derivado que agrupa los sobrevivientes por sexo
    unsubscribe = dataBySurvivingBySex.subscribe(d => {
      chartData = d;
      console.log("Datos para ScatterPlot:", chartData);
      drawChart();
    });
  
    const width = 600, height = 400;
    const margin = { top: 30, right: 20, bottom: 50, left: 70 };
  
    function drawChart() {
      const container = document.getElementById('scatterchart');
      if (!container) return;
      container.innerHTML = ''; // Limpiar contenido previo
  
      const svg = select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
  
      // Verificar que chartData y chartData.data existan
      if (!chartData || !chartData.data) return;
  
      // Aplanar los datos: generar un array de sobrevivientes con la información de cada sexo
      // Suponemos que chartData.data tiene la forma:
      // [ { Sex: 'male', Values: [ { Age, ... }, ... ], count: X }, { Sex: 'female', Values: [...] } ]
      const flatData = chartData.data.flatMap(d =>
        d.Values.map(v => ({ ...v, Sex: d.Sex }))
      );
  
      // Escala X: edad (calculada a partir del extent de flatData)
      const xExtent = d3.extent(flatData, d => d.Age);
      const xScale = scaleLinear()
        .domain(xExtent)
        .nice()
        .range([margin.left, width - margin.right]);
  
      // Escala Y: sexo (usamos scalePoint para posicionar "male" y "female")
      const yScale = scalePoint()
        .domain(['male', 'female'])
        .range([height - margin.bottom, margin.top])
        .padding(0.5);
  
      // Dibujar eje X
      svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(axisBottom(xScale))
        .append('text')
        .attr('fill', 'black')
        .attr('x', (width - margin.left - margin.right) / 2 + margin.left)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Edad');
  
      // Dibujar eje Y
      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(axisLeft(yScale))
        .append('text')
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .text('Sexo');
  
      // Dibujar puntos para cada sobreviviente
      svg.selectAll('circle')
        .data(flatData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.Age))
        .attr('cy', d => yScale(d.Sex))
        .attr('r', 5)
        .attr('fill', d => d.Sex === 'male' ? 'steelblue' : 'pink')
        .attr('opacity', 0.8);
  
      // Añadir leyenda
      const legendData = [
        { label: 'Hombre', color: 'steelblue' },
        { label: 'Mujer', color: 'pink' }
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
          g.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 5)
            .attr('fill', d.color);
          g.append('text')
            .attr('x', 15)
            .attr('y', 5)
            .text(d.label)
            .attr('font-size', '12px')
            .attr('fill', 'black');
        });
    }
  
    onDestroy(() => {
      unsubscribe();
    });
  </script>
  
  <div id="scatterchart"></div>
  