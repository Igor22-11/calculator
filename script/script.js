document.addEventListener('DOMContentLoaded', () => {
  const rootDiv = document.body;
  let selectMaterial;
  let selectPipe;
  let inputWidth;
  let inputLength;
  let selectStrength;
  let buttonCalculate;
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

    const resultSection = createResultSection();
    container.append(resultSection);

    calculationOfMatherials(configData, resultSection.querySelector('#calculation-result'));
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

    selectMaterial = section.querySelector('#select-material');
    selectPipe = section.querySelector('#pipe-select');
    inputWidth = section.querySelector('#width-input');
    inputLength = section.querySelector('#length-input');
    selectStrength = section.querySelector('#strength-select');

    const materialsList = materialsData.filter(item => item.type === 'list')
      .sort((a, b) => a.price - b.price);

    materialsList.forEach(list => {
      const option = document.createElement('option');
      option.value = JSON.stringify({ name: list.name, width: list.width, material: list.material, price: list.price });
      option.textContent = `${list.name} (ширина: ${list.width}м, цена: ${list.price})`;
      selectMaterial.append(option);
    });

    const materialsPipe = materialsData.filter(item => item.type === 'pipe')
      .sort((a, b) => a.price - b.price);

    materialsPipe.forEach(pipe => {
      const option = document.createElement('option');
      option.value = JSON.stringify({ name: pipe.name, width: pipe.width, price: pipe.price });
      option.textContent = `${pipe.name} (сечение: ${pipe.width}мм, цена: ${pipe.price})`;
      selectPipe.append(option);
    });

    const frameOptions = configData.filter(item => item.type === 'frame')
      .sort((a, b) => a.name - b.name);
    frameOptions.forEach(frame => {
      const option = document.createElement('option');
      option.value = frame.key;
      option.textContent = frame.name;
      selectStrength.append(option);
    });

    const constraintWidth = configData.find(item => item.type === 'size' && item.key === 'width');
    if (constraintWidth) {
      inputWidth.min = constraintWidth.min;
      inputWidth.max = constraintWidth.max;
      inputWidth.step = constraintWidth.step;
    }

    const lengthConstraint = configData.find(item => item.type === 'size' && item.key === 'length');
    if (lengthConstraint) {
      inputLength.min = lengthConstraint.min;
      inputLength.max = lengthConstraint.max;
      inputLength.step = lengthConstraint.step;
    }

    console.log(materialsList);

    return section;
  }

  function createResultSection() {
    const section = document.createElement('div');
    section.className = 'result-section';
    section.innerHTML = `
        <h2>Результат расчета</h2>
        <div id="calculation-result">
            <p>Пожалуйста, введите данные и нажмите "Рассчитать".</p>
        </div>
    `;
    return section;
  }

  function calculationOfMatherials(configData, resultDiv) {
    buttonCalculate = document.getElementById('calculate-button');

    [inputWidth, inputLength].forEach(input => {
      input.addEventListener('input', () => {
        const key = input.id.replace('-input', '');
        const constraints = configData.find(item => item.type === 'size' && item.key === key);
        const value = parseFloat(input.value);
        if (constraints && (isNaN(value) || value < constraints.min || value > constraints.max)) {
          input.classList.add('invalid');
        } else {
          input.classList.remove('invalid');
        }
      });
    });

    buttonCalculate.addEventListener('click', () => {


      if (inputWidth.classList.contains('invalid') || inputLength.classList.contains('invalid')) {
        console.log('Push');
        resultDiv.innerHTML = '<p class="error">Введите корректные значения ширины и длины каркаса.</p>';
        return;
      }
    })


  }



});
