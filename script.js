"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const renderCountry = function (data, className = "") {
  const currency = Object.values(data.currencies)?.[0];
  const countryCurrency = currency.name;
  const language = Object.values(data.languages)[0];
  const html = `     
    <article class="country  ${className}">
      <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}</p>
        <p class="country__row"><span>🗣️</span>${language}</p>
        <p class="country__row"><span>💰</span>${countryCurrency}</p>
      </div>
    </article>`;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};
const getJSON = function (apiLink, errorMessage = "Something went wrong") {
  return fetch(apiLink).then((response) => {
    if (!response.ok) throw new Error(`${errorMessage} ${response.status}`);
    return response.json();
  });
};
const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, "Country not found")
    .then((data) => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        "neighbour not found"
      );
    })
    .then((data) => renderCountry(data[0], "neighbour"))
    .catch((err) => {
      console.error(`💥 ${err.message}`);
      // Optionally display error to user
      countriesContainer.insertAdjacentHTML(
        "beforeend",
        `<p class="error">💥 ${`You have an error: ${err.message}`}</p>`
      );
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
btn.addEventListener("click", () => {
  getCountryData("india");
});

// const whereAmI = async function (country) {
//   const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
//   const data = await res.json();
//   console.log(data);
//   renderCountry(data[0]);
// };
// whereAmI("india");
