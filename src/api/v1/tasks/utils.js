
module.exports.calculateTaskDuration = async ({ set }) => {
  const reduceTimes = (acc, item) => {
    const { duration } = item;
    if (!duration) return acc;
    return acc + duration;
  };

  const durationTask = set.reduce(reduceTimes, 0);
  return durationTask
};
