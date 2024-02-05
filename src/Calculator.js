import { memo, useEffect, useReducer } from "react";
import clickSound from "./ClickSound.m4a";

const initialCalc = {
  number: 0,
  sets: 3,
  speed: 90,
  durationBreak: 5,
  duration: 0,
};

const calcReducer = (state, action) => {
  let newState = {};
  switch (action.type) {
    case "setNumber":
      newState = { ...state, number: action.payLoad };
      break;
    case "setSets":
      newState = { ...state, sets: action.payLoad };
      break;
    case "setSpeed":
      newState = { ...state, speed: action.payLoad };
      break;
    case "setDurationBreak":
      newState = { ...state, durationBreak: action.payLoad };
      break;
    case "durationInc":
      return { ...state, duration: Math.floor(state.duration + 1) };
    case "durationDec":
      return {
        ...state,
        duration: state.duration > 1 ? Math.ceil(state.duration - 1) : 0,
      };
    default:
      throw new Error("undefined action type in calculator reducer");
  }
  const { number, sets, speed, durationBreak } = newState;
  return {
    ...newState,
    duration: (number * sets * speed) / 60 + (sets - 1) * durationBreak,
  };
};

function Calculator({ workouts, allowSound }) {
  const [{ number, sets, speed, durationBreak, duration }, disCalc] =
    useReducer(calcReducer, {
      ...initialCalc,
      number: workouts.at(0).numExercises,
      duration:
        (workouts.at(0).numExercises * initialCalc.sets * initialCalc.speed) /
          60 +
        (initialCalc.sets - 1) * initialCalc.durationBreak,
    });

  // const [number, setNumber] = useState(workouts.at(0).numExercises);
  // const [sets, setSets] = useState(3);
  // const [speed, setSpeed] = useState(90);
  // const [durationBreak, setDurationBreak] = useState(5);

  // const [duration, setDuration] = useState(0);

  // useEffect(() => {
  //   setDuration((number * sets * speed) / 60 + (sets - 1) * durationBreak);
  // }, [durationBreak, number, sets, speed]);

  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;

  useEffect(() => {
    // disCalc({ type: "setSets", payLoad: 3 });
    const playSound = function () {
      if (!allowSound) return;
      const sound = new Audio(clickSound);
      sound.play();
    };
    playSound();
  }, [allowSound, duration]);

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select
            value={number}
            onChange={(e) =>
              disCalc({ type: "setNumber", payLoad: +e.target.value })
            }
          >
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={(e) =>
              disCalc({ type: "setSets", payLoad: +e.target.value })
            }
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) =>
              disCalc({ type: "setSpeed", payLoad: +e.target.value })
            }
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) =>
              disCalc({ type: "setDurationBreak", payLoad: +e.target.value })
            }
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={() => disCalc({ type: "durationDec" })}>–</button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button onClick={() => disCalc({ type: "durationInc" })}>+</button>
      </section>
    </>
  );
}

export default memo(Calculator);
