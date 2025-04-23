export const generateRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateMonthlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    name: month,
    revenue: generateRandomValue(0, 6000),
    users: generateRandomValue(1000, 5000),
    activeUsers: generateRandomValue(500, 3000),
    newPosts: generateRandomValue(50, 200),
    activeNow: generateRandomValue(100, 1000),
  }));
};

export const generateUserActivity = () => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  return hours.map(hour => ({
    hour,
    users: generateRandomValue(50, 500),
  }));
};

export const generateCurrentStats = () => ({
  totalUsers: generateRandomValue(10000, 20000),
  activeUsers: generateRandomValue(5000, 10000),
  newPosts: generateRandomValue(100, 500),
  activeNow: generateRandomValue(200, 2000),
  revenue: generateRandomValue(2000, 6000),
});
