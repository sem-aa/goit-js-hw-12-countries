import "./main.css";
import countryCardTpl from "./templates/country-template.hbs";
import listCountry from "./templates/country-list.hbs";

import { error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import debounce from "lodash.debounce";

const markupEl = document.querySelector(".country-container");
const searchCountry = document.querySelector("input");

searchCountry.addEventListener("input", debounce(onSearch, 500));

function onSearch() {
  const inputSearch = searchCountry.value;
  if (inputSearch === "") {
    markupEl.innerHTML = "";
    return;
  }

  fetchCountry(inputSearch)
    .then(renderCountry)
    .catch((error) => console.log(error));
}

function fetchCountry(countryName) {
  return fetch(`https://restcountries.eu/rest/v2/name/${countryName}`).then(
    (respone) => {
      if (respone.status === 404) {
        error({
          title: "Нет такой страны",
          text: "Введите корректное название",
          icon: true,
          delay: 3000,
        });
      }
      return respone.json();
    }
  );
}

function renderCountry(country) {
  console.log(country);
  if (country.length > 10) {
    error({
      title: "Ошибка",
      text: "Введите больше символов",
      icon: true,
      delay: 3000,
    });
    markupEl.innerHTML = "";
  }
  if (country.length >= 2 && country.length <= 10) {
    markupEl.innerHTML = listCountry(country);
  }
  if (country.length === 1) {
    markupEl.innerHTML = countryCardTpl(country);
  }
}
