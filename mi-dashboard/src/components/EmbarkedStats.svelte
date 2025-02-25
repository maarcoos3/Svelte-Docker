<script>
    import { onDestroy } from 'svelte';
    import { dataBySurvivingByEmbarked } from '../stores_titanic.js';
    import { select, scaleBand, scaleLinear, max, axisBottom, axisLeft } from 'd3';
  
    let chartData = null;
    let unsubscribe;
  
    // Nos suscribimos al store derivado de datos agrupados por puerto
    unsubscribe = dataBySurvivingByEmbarked.subscribe(d => {
      chartData = d;
      console.log("Datos para EmbarkedStats:", chartData);
      drawChart();
    });
  
    const width = 500, height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  
    function drawChart() {
      const container = document.getElementById('embarkedchart');
      if (!container) return;
      container.innerHTML = ''; // Limpiar contenido previo
  
      const svg = select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
  
      // Verificar que chartData y chartData.data existan
      if (!chartData || !chartData.data) return;
      
      // Convertir chartData.data al formato: [{ Puerto, count }, ...]
      const grouped = chartData.data.map(d => ({
        Puerto: d.Puerto,
        count: d.count
      })).filter(d => ['C', 'Q', 'S'].includes(d.Puerto));
  
      // Calcular el máximo, asignando un valor mínimo para evitar NaN
      const maxCountValue = max(grouped, d => d.count) || 0;
      const yDomainMax = maxCountValue === 0 ? 1 : maxCountValue;
  
      // Escala para el eje X: los puertos
      const xScale = scaleBand()
        .domain(grouped.map(d => d.Puerto))
        .range([margin.left, width - margin.right])
        .padding(0.1);
  
      // Escala para el eje Y: cantidad de pasajeros
      const yScale = scaleLinear()
        .domain([0, yDomainMax])
        .nice()
        .range([height - margin.bottom, margin.top]);
  
      // Eje X
      svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(axisBottom(xScale))
        .append('text')
        .attr('fill', 'black')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Puerto de embarque');
  
      // Eje Y
      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(axisLeft(yScale))
        .append('text')
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .text('Cantidad de pasajeros');
  
      // Dibujar las barras
      svg.selectAll('.bar')
        .data(grouped)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.Puerto))
        .attr('y', d => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - margin.bottom - yScale(d.count))
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
          const g = select(this);
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
  
    onDestroy(() => {
      unsubscribe();
    });
  </script>
  
  <div id="embarkedchart"></div>
  