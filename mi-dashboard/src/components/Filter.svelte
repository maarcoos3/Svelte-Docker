<script>
    import { filters } from "../stores_titanic.js";
    
    function toggleFilter(key) {
      filters.update(f => ({ ...f, [key]: !f[key] }));
    }
  </script>
  
  <div class="filter-card">
    <div class="filter-group">
      <h3>Sexo</h3>
      <label>
        <input type="checkbox" checked={$filters.male} on:change={() => toggleFilter("male")} />
        Hombre
      </label>
      <label>
        <input type="checkbox" checked={$filters.female} on:change={() => toggleFilter("female")} />
        Mujer
      </label>
    </div>
    
    <div class="filter-group">
      <h3>Puerto</h3>
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
    </div>
    
    <div class="filter-group">
      <h3>Clase</h3>
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
  </div>
  
  <style>
    .filter-card {
      background: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      max-width: 600px;
      margin: 0 auto 20px auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .filter-group h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      color: #555;
      cursor: pointer;
    }
    input[type="checkbox"] {
      transform: scale(1.1);
      cursor: pointer;
    }
  </style>
  