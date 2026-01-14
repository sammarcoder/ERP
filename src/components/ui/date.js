function formatMyDate(dateString) {
    const parts = dateString.split('/');
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
}

let inputDate = "21/11/2025";
let formattedDate = formatMyDate(inputDate); // Output: "21/Nov/25"
console.log(formattedDate);
export default formatMyDate;