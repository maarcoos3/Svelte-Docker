// titanic_stores.js
// @ts-nocheck
import { readable, derived, writable } from 'svelte/store';
import { csv, autoType, extent, max } from 'd3';

const dataPath = './data/Titanic-Dataset.csv';

// Store de datos: se carga el CSV y se convierte automáticamente el tipo de datos.
export const dataTitanic = readable([], set => { 
  csv(dataPath, autoType).then(data => set(data));
});

// Store de filtros: inicialmente se aceptan todos los datos.
// Para los filtros de checkboxes se usan booleanos; para edad se definen valores numéricos.
export const filters = writable({
  male: true,
  female: true,
  class1: true,
  class2: true,
  class3: true,
  pC: true,
  pS: true,
  pQ: true,
  minAge: 0,
  maxAge: 100
});

// Datos para barChart por género: agrupa los registros sobrevivientes por sexo.
export const dataBySurvivingBySex = derived(
  [dataTitanic, filters],
  ([$dataTitanic, $filters]) => {
    const survivors = $dataTitanic.filter(d =>
      d.Survived === 1 &&
      d.Age !== null &&
      $filters[d.Sex] &&
      $filters[`class${d.Pclass}`] &&
      $filters[`p${d.Embarked}`]
    );
    const grouped = survivors.reduce((acc, d) => {
      const sex = d.Sex;
      if (!acc[sex]) acc[sex] = [];
      acc[sex].push(d);
      return acc;
    }, {});
    const processedData = Object.entries(grouped).map(([sex, values]) => ({
      Sex: sex,
      Values: values,
      count: values.length
    }));
    const total = processedData.reduce((sum, item) => sum + item.count, 0);
    return { data: processedData, total };
  }
);

// Datos para barChart por Puerto de embarque: agrupa los registros sobrevivientes por puerto.
export const dataBySurvivingByEmbarked = derived(
  [dataTitanic, filters],
  ([$dataTitanic, $filters]) => {
    const survivors = $dataTitanic.filter(d =>
      d.Survived === 1 &&
      d.Age !== null &&
      $filters[d.Sex] &&
      $filters[`class${d.Pclass}`] &&
      $filters[`p${d.Embarked}`]
    );
    const grouped = survivors.reduce((acc, d) => {
      const port = d.Embarked;
      if (!acc[port]) acc[port] = [];
      acc[port].push(d);
      return acc;
    }, {});
    const processedData = Object.entries(grouped).map(([port, values]) => ({
      Puerto: port,
      Values: values,
      count: values.length
    }));
    const total = processedData.reduce((sum, item) => sum + item.count, 0);
    return { data: processedData, total };
  }
);

// Datos para multilineChart por edad y clase: agrupa sobrevivientes por clase y por edad (redondeada hacia abajo).
export const dataByClass = derived(
  [dataTitanic, filters],
  ([$dataTitanic, $filters])  => {
    const survivors = $dataTitanic.filter(d =>
      d.Survived === 1 &&
      d.Age !== null &&
      $filters[d.Sex] &&
      $filters[`class${d.Pclass}`] &&
      $filters[`p${d.Embarked}`]
    );
    // Agrupar manualmente por Pclass y luego por edad (redondeada)
    const grouped = survivors.reduce((acc, d) => {
      const pclass = d.Pclass;
      const age = Math.floor(d.Age);
      if (!acc[pclass]) acc[pclass] = {};
      if (!acc[pclass][age]) acc[pclass][age] = [];
      acc[pclass][age].push(d);
      return acc;
    }, {});
    
    const processedData = Object.entries(grouped).map(([pclass, ages]) => ({
      pclass: pclass,
      values: Object.entries(ages)
        .map(([age, people]) => ({
          Age: Number(age),
          count: people.length
        }))
        .sort((a, b) => a.Age - b.Age)
    }));
    return processedData;
  }
);

// Rango de edad para la escala horizontal del multilineChart.
export const ageExtent = derived(
  dataByClass,
  $dataByClass => extent($dataByClass.flatMap(d => d.values.map(v => v.Age)))
);

// Valor máximo (cantidad) para la escala vertical del multilineChart.
export const maxCount = derived(
  dataByClass,
  $dataByClass => max($dataByClass.flatMap(d => d.values.map(v => v.count)))
);

// Dominio para la escala de edad a nivel global.
export const valueDomainTitanic = derived(
  dataTitanic,
  $dataTitanic => extent($dataTitanic, d => d.Age)
);
