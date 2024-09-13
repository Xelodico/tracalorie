class CalorieTracker {
  #calorieLimit = 2000;
  #totalCalories = 0;
  #meals = [];
  #workouts = [];

  constructor() {
    this.#displayCaloriesLimit();
    this.#displayCaloriesTotal();
    this.#displayCaloriesConsumed();
    this.#displayCaloriesBurned();
    this.#displayCaloriesRemaining();
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
  }

  #render() {
    this.#displayCaloriesTotal();
    this.#displayCaloriesConsumed();
    this.#displayCaloriesBurned();
    this.#displayCaloriesRemaining();
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

const tracker = new CalorieTracker();

const breakfast = new Meal("Breakfast", 400);
tracker.addMeal(breakfast);

const run = new Workout("Morning Run", 320);
tracker.addWorkout(run);
