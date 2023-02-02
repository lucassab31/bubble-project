import style from "./Recap.module.css"
import baoImage from "../../assets/img/bao.png"
import RecapItem from "../RecapItem/RecapItem";
import { useParams, useLocation } from 'react-router-dom';

export default function Recap() {
    const { orderNumber } = useParams();
    const location = useLocation();
    const { cart, tableNumber } = location.state;

    return (
        <div className={style["order-recap-page"]}>
            <div className={style["order-recap"]}>
                <div className={style["logo-container"]}>
                    <img src={baoImage} alt="image Bao" />
                </div>
            <div className={style["order-number"]}>Commande n°{orderNumber}</div>
                <div className={style["table-number"]}>Table n°{tableNumber}</div>
                <div className={style["separator"]}>~</div>
                <ul className={style["products-list"]}>
                    {cart.map((product, i) => <RecapItem key={i} productInfo={product} />)}
                </ul>
                <div className={style["order-total"]}><span>Montant total :</span> {cart.length > 0 ? cart.map(product => product.quantité * product.prix).reduce((price, currValue) => price + currValue) : 0}€</div>
            </div>
        </div>
    )
}
