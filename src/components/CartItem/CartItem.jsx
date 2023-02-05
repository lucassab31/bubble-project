import QuantitySelector from '../QuantitySelector/QuantitySelector'
import { useState, useEffect } from 'react'
import style from './CartItem.module.css'

export default function CartItem({ productInfo, cart, setCart }) {
    const [productQuantity, setProductQuantity] = useState(productInfo.quantité);
    const productOptions = Object.keys(productInfo.options).filter(option => option !== "extras");
    const productCartIndex = cart.findIndex(product => product.id === productInfo.id && JSON.stringify(product.options) === JSON.stringify(productInfo.options))

    const removeExtra = (extra) => {
        const extraIndex = productInfo.options.extras.findIndex(extraName => extraName === extra);

        const extras = [...productInfo.options.extras];
        extras.splice(extraIndex, 1);

        const extrasPrices = [...productInfo["prix des extras"]];
        extrasPrices.splice(extraIndex, 1);

        const newCart = [...cart];
        newCart.splice(productCartIndex, 1, { ...cart[productCartIndex], options: { ...cart[productCartIndex].options, extras: extras }, prix: cart[productCartIndex].prix - productInfo["prix des extras"][extraIndex], "prix des extras": extrasPrices });
        setCart(newCart);
    };

    useEffect(() => {
        setProductQuantity(productInfo.quantité);
    }, [cart])

    useEffect(() => {
        const newCart = [...cart];

        if (productQuantity === 0) {
            newCart.splice(productCartIndex, 1);
            setCart(newCart);
            return;
        }

        newCart.splice(productCartIndex, 1, { ...cart[productCartIndex], quantité: productQuantity });
        setCart(newCart);
    }, [productQuantity])


    return (
        <li className={style["cart-item"]}>
            <div className={style["cart-item-image"]}>
                <img src={productInfo.image} alt={`image ${productInfo.nom}`} />
            </div>
            <div className={style["cart-item-info"]}>
                <div className={style["cart-item-name"]}>{productInfo.nom}</div>
                <ul className={style["item-options-list"]}>
                    {productOptions.map(option => productInfo.options[option]).filter(values => values.length > 0).map((values, i) => <li key={i} className={style["item-options-list__item"]}>
                        <span>{productOptions[i].charAt(0).toUpperCase() + productOptions[i].slice(1)}</span> : {values.join(", ")}</li>)}
                </ul>
                {productInfo.options.extras.map((extra, i) => (
                    <div key={i} className={style["extra"]}>
                        <div onClick={() => removeExtra(extra)} className={style["remove-option"]}>
                            -
                        </div>
                        <div className={style["extra__name"]}>
                            Extra {extra.toLowerCase()}
                        </div>
                    </div>))}
                <div className={style["cart-item-price"]}>{productInfo.prix.toFixed(2)}€</div>
            </div>
            <div className={style["cart-item-quantity"]}>
                <QuantitySelector quantity={productQuantity} setQuantity={setProductQuantity} minimum={0} />
            </div>
        </li>
    )
}
