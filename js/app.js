class CalorieTracker {
  #calorieLimit;
  #totalCalories;
  #meals;
  #workouts;

  constructor() {
    this.#calorieLimit = Storage.getCalorieLimit();
    this.#totalCalories = Storage.getTotalCalories();
    this.#meals = Storage.getMeals();
    this.#workouts = Storage.getWorkouts();

    this.#displayCaloriesLimit();
    this.#render();

    document.querySelector("#limit").value = this.#calorieLimit;
  }

  // Public Methods/API

  addMeal(meal) {
    this.#meals.push(meal);
    this.#totalCalories += meal.calories;
    Storage.updateTotalCalories(this.#totalCalories);
    Storage.saveMeal(meal);
    this.#displayNewMeal(meal);
    this.#render();
  }

  addWorkout(workout) {
    this.#workouts.push(workout);
    this.#totalCalories -= workout.calories;
    Storage.updateTotalCalories(this.#totalCalories);
    Storage.saveWorkout(workout);
    this.#displayNewWorkout(workout);
    this.#render();
  }

  removeMeal(id) {
    const index = this.#meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this.#meals[index];
      this.#totalCalories -= meal.calories;
      Storage.updateTotalCalories(this.#totalCalories);
      this.#meals.splice(index, 1);
      Storage.removeMeal(id);
      this.#render();
    }
  }

  removeWorkout(id) {
    const index = this.#workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this.#workouts[index];
      this.#totalCalories += workout.calories;
      Storage.updateTotalCalories(this.#totalCalories);
      this.#workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this.#render();
    }
  }

  reset() {
    this.#totalCalories = 0;
    this.#meals = [];
    this.#workouts = [];
    Storage.clearAll();
    this.#render();
  }

  setLimit(calorieLimit) {
    this.#calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this.#displayCaloriesLimit();
    this.#render();
  }

  loadItems() {
    this.#meals.forEach((meal) => this.#displayNewMeal(meal));
    this.#workouts.forEach((workout) => this.#displayNewWorkout(workout));
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

  #displayNewMeal(meal) {
    const mealsEl = document.querySelector("#meal-items");
    const mealEl = document.createElement("div");
    mealEl.classList.add("card", "my-2");
    mealEl.setAttribute("data-id", meal.id);

    mealEl.innerHTML = `
    <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>`;

    mealsEl.appendChild(mealEl);
  }

  #displayNewWorkout(workout) {
    const workoutsEl = document.querySelector("#workout-items");
    const workoutEl = document.createElement("div");
    workoutEl.classList.add("card", "my-2");
    workoutEl.setAttribute("data-id", workout.id);

    workoutEl.innerHTML = `
    <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>`;

    workoutsEl.appendChild(workoutEl);
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

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit");
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem("totalCalories") === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem("totalCalories");
    }
    return totalCalories;
  }

  static updateTotalCalories(calories) {
    localStorage.setItem("totalCalories", calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem("meals") === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem("meals"));
    }
    return meals;
  }

  static saveMeal(meal) {
    let meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static removeMeal(id) {
    let meals = Storage.getMeals();
    meals = meals.filter((meal) => meal.id !== id);
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem("workouts") === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    }
    return workouts;
  }

  static saveWorkout(workout) {
    let workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    let workouts = Storage.getWorkouts();
    workouts = workouts.filter((workout) => workout.id !== id);
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static clearAll() {
    localStorage.removeItem("totalCalories");
    localStorage.removeItem("meals");
    localStorage.removeItem("workouts");

    // If you want to clear the limit,
    // localStorage.clear();
  }
}

class App {
  #tracker;

  constructor() {
    this.#tracker = new CalorieTracker();
    this.#loadEventListeners();
    this.#tracker.loadItems();
  }

  #loadEventListeners() {
    document
      .querySelector("#meal-form")
      .addEventListener("submit", this.#newItem.bind(this, "meal"));
    document
      .querySelector("#workout-form")
      .addEventListener("submit", this.#newItem.bind(this, "workout"));
    document
      .querySelector("#meal-items")
      .addEventListener("click", this.#removeItem.bind(this, "meal"));
    document
      .querySelector("#workout-items")
      .addEventListener("click", this.#removeItem.bind(this, "workout"));
    document
      .querySelector("#filter-meals")
      .addEventListener("keyup", this.#filterItems.bind(this, "meal"));
    document
      .querySelector("#filter-workouts")
      .addEventListener("keyup", this.#filterItems.bind(this, "workout"));
    document
      .querySelector("#reset")
      .addEventListener("click", this.#reset.bind(this));
    document
      .querySelector("#limit-form")
      .addEventListener("submit", this.#setLimit.bind(this));
  }

  #newItem(type, e) {
    e.preventDefault();

    const name = document.querySelector(`#${type}-name`);
    const calories = document.querySelector(`#${type}-calories`);

    // Validate input
    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
      return;
    }

    if (type === "meal") {
      const meal = new Meal(name.value, +calories.value);
      this.#tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this.#tracker.addWorkout(workout);
    }

    name.value = "";
    calories.value = "";

    const collapseItem = document.querySelector(`#collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, { toggle: true });
  }

  #removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").getAttribute("data-id");

        type === "meal"
          ? this.#tracker.removeMeal(id)
          : this.#tracker.removeWorkout(id);

        e.target.closest(".card").remove();
      }
    }
  }

  #filterItems(type, e) {
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

  #reset() {
    this.#tracker.reset();
    document.querySelector("#meal-items").innerHTML = "";
    document.querySelector("#workout-items").innerHTML = "";
    document.querySelector("#filter-meals").value = "";
    document.querySelector("#filter-workouts").value = "";
  }

  #setLimit(e) {
    e.preventDefault();
    const limit = document.querySelector("#limit");

    if (limit.value === "") {
      alert("Please add a limit");
      return;
    }

    this.#tracker.setLimit(+limit.value);
    limit.value = "";

    // Close the bootstrap modal
    const modalEl = document.querySelector("#limit-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
