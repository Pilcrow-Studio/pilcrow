const useCurrency = () => {
  const formatCurrency = (amount, currency = "NOK", locale = "no-NO") => {
    if (!amount || isNaN(amount)) return "";
    return new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ",- " + currency;
  };
  return {
    formatCurrency
  };
};

export { useCurrency as u };
//# sourceMappingURL=useCurrency-CxkotuyY.mjs.map
