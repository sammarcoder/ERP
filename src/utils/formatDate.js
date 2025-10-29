// // utils/formatDate.js

// export function formatDateToDisplay(dateStr) {
//   if (!dateStr) return "";

//   // Support MM/DD/YYYY or Date object
//   let date;
//   if (typeof dateStr === "string") {
//     const parts = dateStr.split("/");
//     if (parts.length < 3) return dateStr;
//     const [month, day, year] = parts;
//     date = new Date(`${year.length === 2 ? "20" + year : year}-${month}-${day}`);
//   } else if (dateStr instanceof Date) {
//     date = dateStr;
//   } else {
//     return dateStr;
//   }

//   if (isNaN(date)) return dateStr;

//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   return `${String(date.getDate()).padStart(2, '0')}/${months[date.getMonth()]}/${String(date.getFullYear()).slice(-2)}`;
// }























// utils/formatters.js
export function formatDisplayDate(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(date.getDate()).padStart(2, "0")}/${months[date.getMonth()]}/${String(date.getFullYear()).slice(-2)}`;
}
