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
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then((response) => response.json())
    .then((data) => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];

      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then((response) => {
      if (!response.ok)
        throw new Error(`Neighbour not found (${response.status})`);
      return response.json();
    })
    .then((data) => renderCountry(data[0], "neighbour"))
    .catch((err) => {
      console.error(`💥 ${err.message}`);
      // Optionally display error to user
      countriesContainer.insertAdjacentHTML(
        "beforeend",
        `<p class="error">💥 ${err.message}</p>`
      );
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

getCountryData("india");
