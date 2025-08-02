const getTransactionId = () => {
  const date = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${date}-${random}`;
};

export default getTransactionId;