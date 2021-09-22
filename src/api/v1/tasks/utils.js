
module.exports.calculateTaskDuration = async ({ set }) => {
  let total = 0;
  const reduceTimes = (acc, item) => {
    const { duration, values: { done } } = item;
    if (!duration || !done) return acc;
    total = total+done;
    return acc + (duration*done);
  };
  const durationTask = set.reduce(reduceTimes, 0) / total;
  return durationTask.toFixed(2)
};
