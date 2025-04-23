export const generateRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateCurrentStats = () => ({
  totalUsers: generateRandomValue(5000, 10000),
  activeUsers: generateRandomValue(2500, 5000),
  newPosts: generateRandomValue(100, 500),
  activeNow: generateRandomValue(200, 2000),
});
