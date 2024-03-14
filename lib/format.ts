export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uk-UK", {
      style: "currency",
      currency: "UAH"
    }).format(price)
  }

