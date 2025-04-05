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





  function renderCalculator(rootDiv, configData, materialsData) {
    console.log(configData)
    console.log(materialsData)

    const container = createElement('div', 'container');
    rootDiv.append(container);

    const inputSection = createSectionInput(configData, materialsData);
    container.append(inputSection);
  }

  function createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }


  function createSectionInput(configData, materialsData) {
    const section = createElement('div', 'section-input')
    section.innerHTML = `
    <h2>Вводные данные</h2>
    <div>
        <label for="select-material">Лист покрытия:</label>
        <select id="select-material"></select>
    </div>
    <div>
        <label for="pipe-select">Труба:</label>
        <select id="pipe-select"></select>
    </div>
    <div>
        <label for="width-input">Ширина каркаса (м):</label>
        <input type="number" id="width-input" min="" max="" step="">
    </div>
    <div>
        <label for="length-input">Длина каркаса (м):</label>
        <input type="number" id="length-input" min="" max="" step="">
    </div>
    <div>
        <label for="strength-select">Прочность каркаса:</label>
        <select id="strength-select"></select>
    </div>
    <button id="calculate-button">Рассчитать</button>
`;

    return section;
  }
});
