function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
function formatDate(dateString) {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

export  {formatDate, formatDateTime}