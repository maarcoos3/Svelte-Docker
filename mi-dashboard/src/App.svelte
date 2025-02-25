<script>
  import BarChart from './components/BarChart.svelte';
  import ScatterPlot from './components/ScatterPlot.svelte';
  import EmbarkedStats from './components/EmbarkedStats.svelte';
  import Filter from './components/Filter.svelte';
</script>

<main>
  <h1>Dashboard Titanic</h1>

  <section class="filter-section">
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
  <section class="full-chart">
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
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .filter-section {
    margin-bottom: 20px;
  }
  
  /* Sección con dos gráficos en línea */
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
  
  /* Gráfico que ocupa todo el ancho */
  .full-chart {
    width: 100%;
  }
  
  section h2 {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }
  
  /* Media query para pantallas pequeñas */
  @media (max-width: 768px) {
    .row {
      flex-direction: column;
    }
  }
</style>
