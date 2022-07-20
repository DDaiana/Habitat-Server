const Habit = require("../models/Habit");
const User = require("../models/User");

async function createHabit(req, res) {
  try {
    //From Front End We Want To Send Frequency, Title Of Habit From The Form & The Email Of Logged In User
    const { title, frequency, id } = req.body;
    const habit = await Habit.create(title, frequency, id);
    console.log(habit);
    res.status(201).json(habit);
  } catch (err) {
    res.status(422).json({ err });
  }
}

function verifyToken(req, res, next) {
  const token = req.headers("authorization");
  console.log("<----------  token ------------>");
  console.log(token);
  console.log("<----------  token ------------>");

  if (token) {
    JsonWebTokenError.verify(
      token,
      "super-secret-password",
      async (err, data) => {
        if (err) {
          res.status(403).json({ err: "invalid token" });
        } else {
          next();
        }
      }
    );
  } else {
    res.status(403).json({ err: "missing token" });
  }
}

//Shows All Habits Stored In Habits Table
async function showAllHabits(req, res) {
  try {
    const habit = await Habit.all;
    res.status(201).json(habit);
  } catch (err) {
    res.status(422).json({ err });
  }
}

async function showCompletedHabits(req, res) {
  const habit = await Habit.completed;
  res.status(201).json(habit);
}

//Shows Habits For Specific Users
async function showUserHabits(req, res) {
  try {
    let id = req.params.id;
    const habits = await Habit.findById(id);
    res.status(201).json(habits);
  } catch (err) {
    res.status(422).json({ err });
  }
}

module.exports = {
  createHabit,
  showAllHabits,
  showCompletedHabits,
  showUserHabits,
};
