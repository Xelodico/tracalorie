class CalorieTracker {
  #calorieLimit = 2000;
  #totalCalories = 0;
  #meals = [];
  #workouts = [];

  addMeal(meal) {
    this.#meals.push(meal);
    this.#totalCalories += meal.calories;
  }

  addWorkout(workout) {
    this.#workouts.push(workout);
    this.#totalCalories -= workout.calories;
  }

  get meals() {
    return this.#meals;
  }
  get workouts() {
    return this.#workouts;
  }

  get totalCalories() {
    return this.#totalCalories;
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

const run = new Workout("Morning Run", 300);
tracker.addWorkout(run);

console.log(tracker.meals);
console.log(tracker.workouts);
console.log(tracker.totalCalories);
