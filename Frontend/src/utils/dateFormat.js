export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date";

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // Handle 11th - 20th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getDaySuffix(
    day
  )} ${month} ${year}, ${formattedHours}:${minutes} ${period}`;
};
