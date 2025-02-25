<script>
    import { filters } from "../stores_titanic.js";
    
    // Utilizamos $filters para acceder al valor actual del store
    function toggleFilter(key) {
      filters.update(f => ({ ...f, [key]: !f[key] }));
    }
  </script>
  
  <div class="filters">
    <h3>Filtrar por Sexo:</h3>
    <label>
      <input type="checkbox" checked={$filters.male} on:change={() => toggleFilter("male")} />
      Hombre
    </label>
    <label>
      <input type="checkbox" checked={$filters.female} on:change={() => toggleFilter("female")} />
      Mujer
    </label>
  
    <h3>Filtrar por Puerto:</h3>
    <label>
      <input type="checkbox" checked={$filters.pC} on:change={() => toggleFilter("pC")} />
      Cherburgo (C)
    </label>
    <label>
      <input type="checkbox" checked={$filters.pS} on:change={() => toggleFilter("pS")} />
      Southampton (S)
    </label>
    <label>
      <input type="checkbox" checked={$filters.pQ} on:change={() => toggleFilter("pQ")} />
      Queenstown (Q)
    </label>
  
    <h3>Filtrar por Clase:</h3>
    <label>
      <input type="checkbox" checked={$filters.class1} on:change={() => toggleFilter("class1")} />
      Primera Clase
    </label>
    <label>
      <input type="checkbox" checked={$filters.class2} on:change={() => toggleFilter("class2")} />
      Segunda Clase
    </label>
    <label>
      <input type="checkbox" checked={$filters.class3} on:change={() => toggleFilter("class3")} />
      Tercera Clase
    </label>
  </div>
  
  <style>
    .filters {
      padding: 10px;
      border: 1px solid #ccc;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    h3 {
      margin: 0;
      font-size: 1.1rem;
    }
    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  </style>
  