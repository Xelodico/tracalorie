class CalorieTracker {
  #calorieLimit = 2000;
  #totalCalories = 0;
  #meals = [];
  #workouts = [];

  constructor() {
    this.#displayCaloriesLimit();
    // this.#displayCaloriesTotal();
    // this.#displayCaloriesConsumed();
    // this.#displayCaloriesBurned();
    // this.#displayCaloriesRemaining();
    // this.#displayCaloriesProgress();
    this.#render();
  }

  // Public Methods/API

  addMeal(meal) {
    this.#meals.push(meal);
    this.#totalCalories += meal.calories;
    this.#render();
  }

  addWorkout(workout) {
    this.#workouts.push(workout);
    this.#totalCalories -= workout.calories;
    this.#render();
  }

  // Private Methods

  #displayCaloriesTotal() {
    const totalCaloriesEl = document.querySelector("#calories-total");
    totalCaloriesEl.textContent = this.#totalCalories;
  }

  #displayCaloriesLimit() {
    const calorieLimitEl = document.querySelector("#calories-limit");
    calorieLimitEl.textContent = this.#calorieLimit;
  }

  #displayCaloriesConsumed() {
    const caloriesConsumedEl = document.querySelector("#calories-consumed");
    const consumed = this.#meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );

    caloriesConsumedEl.textContent = consumed;
  }

  #displayCaloriesBurned() {
    const caloriesBurnedEl = document.querySelector("#calories-burned");
    const burned = this.#workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );

    caloriesBurnedEl.textContent = burned;
  }

  #displayCaloriesRemaining() {
    const caloriesRemainingEl = document.querySelector("#calories-remaining");
    const remaining = this.#calorieLimit - this.#totalCalories;
    caloriesRemainingEl.textContent = remaining;

    const div = caloriesRemainingEl.parentElement.parentElement;
    const progressEl = document.querySelector("#calorie-progress");

    if (remaining <= 0) {
      div.classList.remove("bg-light");
      div.classList.add("bg-danger");
      progressEl.classList.remove("bg-success");
      progressEl.classList.add("bg-danger");
    } else {
      div.classList.add("bg-light");
      div.classList.remove("bg-danger");
      progressEl.classList.add("bg-success");
      progressEl.classList.remove("bg-danger");
    }
  }

  #displayCaloriesProgress() {
    const calorieProgressEl = document.querySelector("#calorie-progress");
    const percentage = (this.#totalCalories / this.#calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    calorieProgressEl.style.width = `${width}%`;
  }

  #render() {
    this.#displayCaloriesTotal();
    this.#displayCaloriesConsumed();
    this.#displayCaloriesBurned();
    this.#displayCaloriesRemaining();
    this.#displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}
class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class App {
  #tracker;

  constructor() {
    this.#tracker = new CalorieTracker();

    document
      .querySelector("#meal-form")
      .addEventListener("submit", this.#newMeal.bind(this));
    document
      .querySelector("#workout-form")
      .addEventListener("submit", this.#newWorkout.bind(this));
  }

  #newMeal(e) {
    e.preventDefault();

    const name = document.querySelector("#meal-name");
    const calories = document.querySelector("#meal-calories");

    // Validate input
    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
      return;
    }

    const meal = new Meal(name.value, +calories.value);
    this.#tracker.addMeal(meal);

    name.value = "";
    calories.value = "";

    const collapseMeal = document.querySelector("#collapse-meal");
    const bsCollapse = new bootstrap.Collapse(collapseMeal, { toggle: true });
  }

  #newWorkout(e) {
    e.preventDefault();

    const name = document.querySelector("#workout-name");
    const calories = document.querySelector("#workout-calories");

    // Validate input
    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
      return;
    }

    const workout = new Workout(name.value, +calories.value);
    this.#tracker.addWorkout(workout);

    name.value = "";
    calories.value = "";

    const collapseWorkout = document.querySelector("#collapse-workout");
    const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
      toggle: true,
    });
  }
}

const app = new App();
