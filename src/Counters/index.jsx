import React from "react";

// State data for 3 counters
const data = [
  { id: 1, value: 0 },
  { id: 2, value: 0 },
  { id: 3, value: 0 },
];

// Counter Component
function Counter(props) {
  const { value } = props;

  return (
    <div className="counter">
      <b>{value}</b>
      <div className="counter-controls">
        <button className="button is-danger is-small">-</button>
        <button className="button is-success is-small">+</button>
      </div>
    </div>
  );
}

const Counters = () => {
  const onIncrement = () => {
    // increase counter, change as needed
  };

  const onDecrement = () => {
    // decrease counter, change as needed
  };

  return (
    <div>
      Counters:
      <div>
        {data.map((counter) => (
          <Counter key={counter.id} value={counter.value} />
        ))}
      </div>
    </div>
  );
};

export default Counters;
