const db = require("../dbconfig/init");
const User = require("./User");

class Habit {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.frequency = data.frequency;
    this.progression = data.progression;
    this.completed = data.completed;
    this.streak = data.streak;
    this.user_id = data.user_id;
  }

  static get all() {
    return new Promise(async (resolve, reject) => {
      try {
        let habitData = await db.query("SELECT * FROM habits");
        let habits = habitData.rows.map((habit) => new Habit(habit));
        console.log(habits);
        resolve(habits);
      } catch (err) {
        reject("Error Retrieving Habits");
      }
    });
  }

  //Finds All User Habits By Id
  static findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let getHabits = await db.query(
          `SELECT * FROM habits WHERE user_id = $1;`,
          [id]
        );
        let habits = getHabits.rows.map((habit) => new Habit(habit));
        resolve(habits);
      } catch (err) {
        reject("Habits Could Not Be Found For This User!");
      }
    });
  }

  //Gets A Habit By Habit ID
  static findHabitById(id) {
    return new Promise(async (resolve, reject) => {
      try {        
        let getHabit = await db.query(`SELECT * FROM habits WHERE id = $1`, [
          id,
        ]);
        let habit =  new Habit(getHabit.rows[0]);        
        resolve(habit);        
        // resolve(getHabit.rows[0]);
      } catch (err) {
        
        reject("Habit Could Not Be Found For This User!");
      }
    });
  }

  static updateProgression(habitId) {
    return new Promise(async (resolve, reject) => {
      try {
        let currentValue = await db.query(
          `SELECT progression FROM habits WHERE id = $1`,
          [habitId]
        );

        // if (newProgressionVal > currentValue.rows[0].frequency) {
        //   resolve(currentValue.rows[0]);
        // }

        // console.log("IN HERE");

        let newProgressionVal = currentValue.rows[0].progression + 1;

        let updateValue = await db.query(
          `UPDATE habits SET progression = $1 WHERE id = $2 RETURNING *;`,
          [newProgressionVal, habitId]
        );
        resolve(updateValue.rows[0]);
      } catch (err) {
        reject("Habit Could Not Be Found For This User!");
      }
    });
  }

  static create(title, frequency, id) {
    return new Promise(async (resolve, reject) => {
      try {
        let completed = "f";
        let streak = 0;
        let progression = 0;
        let createHabit = await db.query(
          "INSERT INTO habits (title, frequency, progression, completed, streak, user_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;",
          [title, frequency, progression, completed, streak, id]
        );
        resolve(createHabit.rows[0]);
      } catch (err) {
        reject("Habit could not be created");
      }
    });
  }

  static get completed() {
    return new Promise(async (resolve, reject) => {
      try {
        let habitData = await db.query(
          "SELECT * FROM habits WHERE completed = 't';"
        );

        let habits = habitData.rows.map((habit) => new Habit(habit));
        resolve(habits);
      } catch (err) {
        reject("Error Retrieving Habits");
      }
    });
  }

  destroy(){    
    console.log("SQL query for deleting")
    return new Promise(async(resolve, reject) => {
        try {
          console.log("SQL query for deleting inside the try")
            await db.query(`DELETE FROM habits WHERE id = $1;`, [ this.id ]);
            resolve('Habit was deleted')
        } catch (err) {
            reject('Habit could not be deleted')
        }
    })
}

// destroy(){
//   return new Promise(async(resolve, reject) => {
//       try {
//           const result = await db.query('DELETE FROM books WHERE id = $1 RETURNING author_id;', [ this.id ]);
//           const author = await Author.findById(result.rows[0].author_id);
//           const books = await author.books;
//           if(!books.length){await author.destroy()}
//           resolve('Book was deleted')
//       } catch (err) {
//           reject('Book could not be deleted')
//       }
//   })
// };
}

module.exports = Habit;
