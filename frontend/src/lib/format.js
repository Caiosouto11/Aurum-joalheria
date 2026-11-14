export const formatPrice = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const installments = (value, times = 10) =>
  `${times}x de ${formatPrice(value / times)} sem juros`;
