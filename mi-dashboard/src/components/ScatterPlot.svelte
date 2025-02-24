<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    let rawData = [];
    const width = 700;
    const height = 450;
    const margin = { top: 30, right: 20, bottom: 50, left: 60 };
  
    // Arrays para las cuatro curvas:
    let menObserved = [];    // Supervivencia observada (hombres)
    let menRelative = [];    // Supervivencia relativa (hombres)
    let womenObserved = [];  // Supervivencia observada (mujeres)
    let womenRelative = [];  // Supervivencia relativa (mujeres)
  
    onMount(async () => {
      // Cargar datos y filtrar
      rawData = await d3.csv('/data/Titanic-Dataset.csv', d3.autoType);
      rawData = rawData.filter(d => d.Age !== null && d.Survived !== null && d.Sex !== null);
  
      //Calcular curvas
      computeLineData();
      drawChart();
    });
  
    function computeLineData() {
      // Definir bins de edad (por ejemplo, cada 5 años de 0 a 80)
      const ageBins = d3.range(0, 85, 5);
  
      // Calcular cuántos hombres y mujeres sobrevivieron en total (para "relativa")
      const totalMenSurvived = rawData.filter(d => d.Sex === 'male' && d.Survived === 1).length;
      const totalWomenSurvived = rawData.filter(d => d.Sex === 'female' && d.Survived === 1).length;
  
      // Inicializar estructuras para contar
      // Mapa: binIndex -> { totalMen, surviveMen, totalWomen, surviveWomen }
      const binData = new Map();
      for (let i = 0; i < ageBins.length - 1; i++) {
        binData.set(i, {
          binStart: ageBins[i],
          binEnd: ageBins[i+1],
          totalMen: 0,
          surviveMen: 0,
          totalWomen: 0,
          surviveWomen: 0
        });
      }
  
      // Clasificar cada registro en su bin de edad
      rawData.forEach(d => {
        let i = d3.bisect(ageBins, d.Age) - 1;
        if (i < 0) i = 0;
        if (i >= ageBins.length - 1) i = ageBins.length - 2;
  
        const record = binData.get(i);
        if (d.Sex === 'male') {
          record.totalMen++;
          if (d.Survived === 1) record.surviveMen++;
        } else {
          record.totalWomen++;
          if (d.Survived === 1) record.surviveWomen++;
        }
      });
  
      // Convertir binData en arrays para dibujar
      menObserved = [];
      menRelative = [];
      womenObserved = [];
      womenRelative = [];
  
      binData.forEach((obj, i) => {
        const midAge = (obj.binStart + obj.binEnd) / 2;
  
        const menObs = obj.totalMen > 0 ? obj.surviveMen / obj.totalMen : 0;
        const menRel = totalMenSurvived > 0 ? obj.surviveMen / totalMenSurvived : 0;
  
        menObserved.push({ age: midAge, value: menObs });
        menRelative.push({ age: midAge, value: menRel });
  
        const womenObs = obj.totalWomen > 0 ? obj.surviveWomen / obj.totalWomen : 0;
        const womenRel = totalWomenSurvived > 0 ? obj.surviveWomen / totalWomenSurvived : 0;
  
        womenObserved.push({ age: midAge, value: womenObs });
        womenRelative.push({ age: midAge, value: womenRel });
      });
  
      // Ordenar arrays por edad
      menObserved.sort((a, b) => a.age - b.age);
      menRelative.sort((a, b) => a.age - b.age);
      womenObserved.sort((a, b) => a.age - b.age);
      womenRelative.sort((a, b) => a.age - b.age);
    }
  
    function drawChart() {
      d3.select('#line-chart').selectAll('svg').remove();
  
      const svg = d3.select('#line-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
  
    //Definir escalas
      const allAges = [
        ...menObserved.map(d => d.age),
        ...menRelative.map(d => d.age),
        ...womenObserved.map(d => d.age),
        ...womenRelative.map(d => d.age)
      ];
      const xMin = d3.min(allAges);
      const xMax = d3.max(allAges);
  
      const allValues = [
        ...menObserved.map(d => d.value),
        ...menRelative.map(d => d.value),
        ...womenObserved.map(d => d.value),
        ...womenRelative.map(d => d.value)
      ];
      const yMax = Math.max(1, d3.max(allValues));
  
      const xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([margin.left, width - margin.right])
        .nice();
  
      const yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([height - margin.bottom, margin.top]);
  
      const xAxis = d3.axisBottom(xScale).ticks(8).tickFormat(d => d + ' años');
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .append('text')
        .attr('fill', 'black')
        .attr('x', (width - margin.left - margin.right) / 2 + margin.left)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Edad');
  
      const yAxis = d3.axisLeft(yScale)
        .ticks(6)
        .tickFormat(d3.format('.0%')); 
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis)
        .append('text')
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .text('Supervivencia');
  
      const lineGen = d3.line()
        .x(d => xScale(d.age))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);
  
      //   - Observada (hombres)
      svg.append('path')
        .datum(menObserved)
        .attr('fill', 'none')
        .attr('stroke', '#A00000')
        .attr('stroke-width', 2)
        .attr('d', lineGen);
  
      //   - Relativa (hombres)
      svg.append('path')
        .datum(menRelative)
        .attr('fill', 'none')
        .attr('stroke', '#FF6347')
        .attr('stroke-width', 2)
        .attr('d', lineGen);
  
      //   - Observada (mujeres)
      svg.append('path')
        .datum(womenObserved)
        .attr('fill', 'none')
        .attr('stroke', '#E69F00')
        .attr('stroke-width', 2)
        .attr('d', lineGen);
  
      //   - Relativa (mujeres)
      svg.append('path')
        .datum(womenRelative)
        .attr('fill', 'none')
        .attr('stroke', '#FFD700') 
        .attr('stroke-width', 2)
        .attr('d', lineGen);
  
      // Leyenda
      const legendData = [
        { label: 'Supervivencia observada (H)', color: '#A00000' },
        { label: 'Supervivencia relativa (H)', color: '#FF6347' },
        { label: 'Supervivencia observada (M)', color: '#E69F00' },
        { label: 'Supervivencia relativa (M)', color: '#FFD700' }
      ];
  
      const legend = svg.append('g')
        .attr('transform', `translate(${width - margin.right - 220}, ${margin.top})`);
  
      legend.selectAll('g')
        .data(legendData)
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`)
        .each(function(d) {
          const g = d3.select(this);
          g.append('rect')
            .attr('width', 15)
            .attr('height', 3)
            .attr('fill', d.color)
            .attr('y', -1);
          g.append('text')
            .attr('x', 20)
            .attr('y', 3)
            .text(d.label)
            .attr('font-size', '12px');
        });
    }
  </script>
  
  <style>
  .tooltip {
    font-size: 12px;
    pointer-events: none;
  }
  </style>
  
  <div id="line-chart"></div>
  