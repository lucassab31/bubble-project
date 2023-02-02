import style from './OptionInput.module.css'

export default function OptionInput({ id, name, value, price, extra, multiple, isActive, onSelectOption }) {
  return (
    <>
      {multiple ? <input className={style["input"]} id={id} type="checkbox" name={name} value={value} /> : <input className={style["input"]} id={id} type="radio" name={name} value={value} />}
      <label onClick={onSelectOption} htmlFor={id} className={isActive ? `${style["option"]} ${style["option--active"]}` : style["option"]}><span className={style["option__value"]}>{value} {price && <span className={style["option__price"]}>- {price}€</span>}</span> {extra && <span className={style["option__extra"]}>+</span>}</label>    
    </>
  )
}
