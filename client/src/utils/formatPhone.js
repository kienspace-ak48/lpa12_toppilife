const formatPhone442 = (phone = "") => {
  const cleaned = phone.replace(/\D/g, "").slice(0,10);

  if (cleaned.length <= 4) return cleaned;
  if (cleaned.length <= 8) return cleaned.replace(/(\d{4})(\d+)/, "$1.$2");

  return cleaned.replace(/(\d{4})(\d{4})(\d+)/, "$1.$2.$3");
};
const formatPhone433 = (phone = "") => {
  const cleaned = phone.replace(/\D/g, "").slice(0, 10);

  if (cleaned.length <= 4) return cleaned;
  if (cleaned.length <= 7) return cleaned.replace(/(\d{4})(\d+)/, "$1.$2");

  return cleaned.replace(/(\d{4})(\d{3})(\d+)/, "$1.$2.$3");
};

export {formatPhone433, formatPhone442}