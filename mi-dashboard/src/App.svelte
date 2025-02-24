<!-- src/App.svelte -->
<script>
  import BarChart from './components/BarChart.svelte';
  import ScatterPlot from './components/ScatterPlot.svelte';
  import EmbarkedStats from './components/EmbarkedStats.svelte';
</script>

<main>
  <h1>Dashboard Titanic</h1>
  
  <section>
    <h2>Distribución de pasajeros por clase y supervivencia</h2>
    <BarChart />
  </section>
  
  <section>
    <h2>Comparación de edad, género y clase en relación con la supervivencia</h2>
    <ScatterPlot />
  </section>
  
  <section>
    <h2>Estadísticas de embarque por ubicación</h2>
    <EmbarkedStats />
  </section>
</main>

