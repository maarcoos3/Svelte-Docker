<script>
  import BarChart from './components/BarChart.svelte';
  import ScatterPlot from './components/ScatterPlot.svelte';
  import EmbarkedStats from './components/EmbarkedStats.svelte';
  import Filter from './components/Filter.svelte';
</script>

<main>
  <h1>Dashboard Titanic</h1>

  <section>
    <Filter />
  </section>

  <!-- Sección con dos gráficos en línea -->
  <section class="row">
    <div class="chart-container">
      <h2>Distribución de pasajeros por clase y supervivencia</h2>
      <BarChart />
    </div>
    <div class="chart-container">
      <h2>Comparación de edad, género y supervivencia</h2>
      <ScatterPlot />
    </div>
  </section>

  <!-- Gráfico completo debajo -->
  <section>
    <h2>Estadísticas de embarque por ubicación</h2>
    <EmbarkedStats />
  </section>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 40px;
  }
  .chart-container {
    flex: 1;
    min-width: 300px;
  }
  section h2 {
    margin-bottom: 10px;
  }
</style>
