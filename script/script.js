document.addEventListener('DOMContentLoaded', () => {
  const rootDiv = document.body;
  getData();

  async function getData() {
    try {
      let materialsData;
      let configData;
      const dataResponse = await fetch('data/data.json');
      if (dataResponse.ok) {
        materialsData = await dataResponse.json();
      } else {
        throw new Error(`Произошла ошибка при загрузке данных data.json: ${dataResponse.status}`);
      }

      const configResponse = await fetch('data/config.json');
      if (configResponse.ok) {
        configData = await configResponse.json();
      } else {
        throw new Error(`Произошла ошибка при загрузке данных config.json: ${configResponse.status}`);
      }

      renderCalculator(rootDiv, configData, materialsData);

    } catch (error) {
      rootDiv.innerHTML = `<div class="error">Произошла ошибка при загрузке данных: ${error.message}</div>`;
    }
  }


});


function renderCalculator(rootDiv, configData, materialsData) {
  console.log(configData)
  console.log(materialsData)

  const container = createElement('div', 'container');
  rootDiv.append(container);
}

function createElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}
