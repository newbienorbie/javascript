import "@fortawesome/fontawesome-free/js/all";
import { Modal, Collapse } from "bootstrap";
import CalorieTracker from "./Tracker.js";
import { Meal, Workout } from "./Item.js";

import "./css/bootstrap.css";
import "./css/style.css";

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();
    this._tracker.loadItems();
  }

  _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal")); // this in event listener will be on the event that it's on, so we need to bind to make it pertains to the new App that was initialized

    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));

    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItems.bind(this, "meal"));

    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItems.bind(this, "workout"));

    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));

    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));

    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));

    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    // validate inputs
    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
      return;
    }

    // there will be a 0 at the front of statistics because calories.value is a string, not number, so we need to add + at the front
    if (type === "meal") {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    // clear the form
    name.value = "";
    calories.value = "";

    // remove collapse after submitted
    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new Collapse(collapseItem, {
      toggle: true,
    });
  }

  /*
  this has been combined to newItem
  _newMeal(e) {
    e.preventDefault();

    const name = document.getElementById("meal-name");
    const calories = document.getElementById("meal-calories");

    // validate inputs
    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
      return;
    }

    // there will be a 0 at the front of statistics because calories.value is a string, not number, so we need to add + at the front
    const meal = new Meal(name.value, +calories.value);

    this._tracker.addMeal(meal);

    // clear the form
    name.value = "";
    calories.value = "";

    // remove collapse after submitted
    const collapseMeal = document.getElementById("collapse-meal");
    const bsCollapse = new bootstrap.Collapse(collapseMeal, {
      toggle: true,
    });
  }

  
  _newWorkout(e) {
    e.preventDefault();

    const name = document.getElementById("workout-name");
    const calories = document.getElementById("workout-calories");

    // validate inputs
    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
      return;
    }

    const workout = new Workout(name.value, +calories.value);

    this._tracker.addWorkout(workout);

    // clear the form
    name.value = "";
    calories.value = "";

    // remove collapse after submitted
    const collapseWorkout = document.getElementById("collapse-workout");
    const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
      toggle: true,
    });
  }
  */

  _removeItems(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").getAttribute("data-id");

        type === "meal"
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        e.target.closest(".card").remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  _reset() {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }

  _setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById("limit");

    if (limit.value === "") {
      alert("Please add a limit");
      return;
    }

    // calorieLimit is in the tracker
    this._tracker.setLimit(+limit.value);
    limit.value = "";

    const modalEl = document.getElementById("limit-modal");
    const modal = Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App(); // initialize the entire application
