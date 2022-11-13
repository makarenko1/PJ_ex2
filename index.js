const API_BASE = 'https://api.nobelprize.org/2.1';
const API_PRIZES_ENDPOINT = `${API_BASE}/nobelPrizes`;

const app = document.getElementById('app');

const dataSort = document.getElementById("data-sort");
dataSort.addEventListener("change", async (event) => {
  console.log("Data Sort Change");
  console.log(event.target.value);
  
  const data = await queryEndpoint(API_PRIZES_ENDPOINT);
  const sortedData = sortData(data, event.target.value);
  await renderUI(sortedData);
})

const dataFilter = document.getElementById("data-filter");
dataFilter.addEventListener("change", async (event) => {
  console.log("Data Filter Change");
  console.log(event.target.value);

  const data = await queryEndpoint(API_PRIZES_ENDPOINT);
  const filteredData = filterData(data, event.target.value);
  await renderUI(filteredData);
})

async function queryEndpoint(endpoint) {
  let data = null;
  try {
    const response = await fetch(endpoint);
    console.log(response);
    if (response.status === 200) {
      data = await response.json();
    }
  } catch (error) {
    console.log('api error');
    console.error(error);
  }
  return data;
}

function getLaureates(prize) {
  let result = ""
  for (const laureate of prize.laureates) {
    if (laureate.knownName) {
      result += `<li>${laureate.knownName.en}</li>`;
    } else if (laureate.orgName) {
      result += `<li>${laureate.orgName.en}</li>`;
    } else {
      result += `<li>${laureate.fullName.en}</li>`;
    }
  } 
  return result;
}

async function renderUI(data) {
  clearUI();

  const { nobelPrizes } = data;
  const recordTemplate = document.getElementById("data-record-template");

  for (const prize of nobelPrizes) {
    console.log(prize);
    const recordClone = recordTemplate.content.firstElementChild.cloneNode(true);
    const heading = recordClone.querySelector("h2");
    const text = recordClone.querySelector("p");
    heading.innerHTML = prize.category.en;
    text.innerHTML = `Laureates: <ul style="list-style: none;">${getLaureates(prize)}</ul><br>
                      Prize amount (adj): ${prize.prizeAmountAdjusted}<br>
                      Year: ${prize.awardYear}`;
    app.appendChild(recordClone);
  }
}

function clearUI() {
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }
}

function filterData(data, key) {
  data.nobelPrizes = data.nobelPrizes.filter((prize) => {
    if (key === "chemistry") {
      return prize.category.en === "Chemistry";
    } else if (key === "physics") {
      return prize.category.en === "Physics";
    } else if (key === "literature") {
      return prize.category.en === "Literature";
    } else if (key === "peace") {
      return prize.category.en === "Peace";
    } else if (key === "physiology-medicine") {
      return prize.category.en === "Physiology or Medicine";
    } else {
      return true;
    }
  });
  return data;
}

function sortData(data, key) {
  data.nobelPrizes = data.nobelPrizes.sort((a, b) => {
    if (a.awardYear > b.awardYear) {
      return key === "oldest-first" ? 1 : -1;
    }
    if (a.awardYear < b.awardYear) {
      return key === "newest-first" ? -1 : 1;
    }
    return 0;
  })
  return data;
}

const data = await queryEndpoint(API_PRIZES_ENDPOINT);
await renderUI(data);
