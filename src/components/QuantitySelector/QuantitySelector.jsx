import style from './QuantitySelector.module.css'

export default function QuantitySelector({ quantity, setQuantity, minimum }) {
  const modifyQuantity = (action) => {
    let minQuantity = 1;

    if(minimum !== undefined) {
      minQuantity = minimum; 
    }

    if (action === "add") {
      if (quantity + 1 <= 5) {
        setQuantity(quantity + 1)
      }
      return
    }

    if (quantity - 1 >= minQuantity) {
      setQuantity(quantity - 1)
    }
  };

  return (
    <div className={style["quantity-selector-container"]}>
      <div onClick={() => modifyQuantity("subtract")} className={style["quantity-selector"]}>-</div>
      <div className={style["quantity"]}>{quantity}</div>
      <div onClick={() => modifyQuantity("add")} className={style["quantity-selector"]}>+</div>
    </div>
  )
}
