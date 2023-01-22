import style from './Cart.module.css'
import CartIcon from "../../assets/img/basket.png"
import Modal from '../Modal/Modal';
import CartItem from '../CartItem/CartItem';
import CreditCardIcon from "../../assets/svg/credit-card-icon.svg"
import CashIcon from "../../assets/svg/cash-icon.svg"
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

export default function Cart({ cart, setCart }) {
    const [showCart, setShowCart] = useState(false);
    const [formError, setFormError] = useState();
    const [paymentMethod, setPaymentMethod] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        setFormError("");
    }, [showCart, paymentMethod])

    const validateCart = (e) => {
        e.preventDefault();

        setFormError("");

        if (e.target["payment-option"].value === "") {
            setFormError("Veuillez sélectionner un moyen de paiement.");
            return;
        }

        setPaymentMethod(e.target["payment-option"].value);
        e.target.scrollTop = 0;
    };

    const payOrder = (e) => {
        e.preventDefault();


        const contactInfo = {
            firstName: e.target["first-name"].value.trim(),
            lastName: e.target["last-name"].value.trim(),
            mail: e.target["mail"].value.trim(),
        }

        setFormError("");

        if (paymentMethod === "cash") {
            if (Object.keys(contactInfo).every(key => contactInfo[key] !== "")) {
                if (/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/.test(contactInfo.mail)) {
                    const orderNumber = Math.floor(Math.random() * (300 - 100 + 1) ) + 100;
                    navigate(`/order-recap/${orderNumber}`, { state: cart })
                    return
                }

                setFormError("Veuillez saisir une adresse mail valide.")
                return
            }

            setFormError("Veuillez remplir tous les champs.")
            return
        }

        const cardInfo = {
            cardNumber: e.target["card-number"].value.trim(),
            cardExpiry: e.target["card-expiry"].value.trim(),
            cardCvc: e.target["card-cvc"].value.trim(),
        }

        if (Object.keys(contactInfo).every(key => contactInfo[key] !== "") && Object.keys(cardInfo).every(key => cardInfo[key] !== "")) {
            let validInputs = true;
            let errorMessage = "";

            if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/.test(contactInfo.mail)) {
                validInputs = false;
                errorMessage = "Veuillez saisir une adresse mail valide.";
            }

            if (!/^\d{4} ?\d{4} ?\d{4} ?\d{4}$/.test(cardInfo.cardNumber)) {
                validInputs = false;
                errorMessage = "Veuillez saisir un numéro de carte correct.";

            }

            if (!/^(0[1-9]|1[0-2]) ?\/ ?(2[3-9]|[3-9][0-9])$/.test(cardInfo.cardExpiry)) {
                validInputs = false;
                errorMessage = "Veuillez saisir une date d'expiration correcte.";
            }

            if (!/^\d{3}$/.test(cardInfo.cardCvc)) {
                validInputs = false;
                errorMessage = "Veuillez saisir un numéro CVC correct.";
            }

            if (validInputs) {
                const orderNumber = Math.floor(Math.random() * (300 - 100 + 1) ) + 100;
                navigate(`/order-recap/${orderNumber}`, { state: cart })
                return
            } else {
                setFormError(errorMessage);
            }

            return
        }

        setFormError("Veuillez remplir tous les champs.")

    };

    return (
        <>
            <div onClick={() => setShowCart(true)} className={style["cart-container"]}>
                <div className={style["quantity-container"]}>
                    {cart.length > 0 ? cart.map(product => product.quantité).reduce((quantity, currValue) => quantity + currValue) : 0}
                </div>
                <div className={style["cart-icon"]}>
                    <img src={CartIcon} alt="icône panier" />
                </div>
            </div>
            {showCart && (
                <Modal setShowModal={setShowCart}>
                    {paymentMethod ? (
                        <>
                            <div onClick={() => setPaymentMethod("")} className={style["return-icon"]}>
                                <i className="bi bi-arrow-left-short"></i>
                            </div>
                            <form onSubmit={payOrder} className={style["payment-form"]}>
                                <div className={style["payment-form__title"]}>Paiement</div>

                                <div className={style["payment-form__subtitle"]}>Informations personnelles</div>

                                <div className={style["contact-info-container"]}>
                                    <div className={style["contact-info"]}>
                                        <input type="text" name="first-name" id="first-name" placeholder='Prénom' />
                                    </div>
                                    <div className={style["contact-info"]}>
                                        <input type="text" name="last-name" id="last-name" placeholder='Nom' />
                                    </div>
                                    <div className={style["contact-info"]}>
                                        <input type="text" name="mail" id="mail" placeholder='Adresse mail' />
                                    </div>
                                </div>

                                {paymentMethod === "card" ? (
                                    <>
                                        <div className={style["payment-form__subtitle"]}>Coordonnées bancaires</div>
                                        <div className={style["card-info-container"]}>
                                            <div className={style["card-info"]}>
                                                <input type="text" name="card-number" placeholder='1234 1234 1234 1234' />
                                            </div>
                                            <div className={style["card-input-group"]}>
                                                <div className={style["card-info"]}>
                                                    <input type="text" name="card-expiry" placeholder='MM / YY' />
                                                </div>
                                                <div className={style["card-info"]}>
                                                    <input type="text" name="card-cvc" placeholder='CVC' />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className={style["payment-form__subtitle"]}>Soumettez le formulaire et rendez-vous au comptoir pour payer.</div>
                                )}

                                {formError && (<div className={style["error"]}>{formError}</div>)}

                                <button className={style["payment-button"]} type="submit">{paymentMethod === "cash" ? "Soumettre" : "Payer"}</button>
                            </form>
                        </>
                    ) : (
                        <form onSubmit={validateCart} className={style["cart-form"]}>
                            <div className={style["cart-form__title"]}>Panier</div>
                            <ul className={style["cart-list"]}>
                                {cart.map((product, i) => <CartItem key={i} productInfo={product} cart={cart} setCart={setCart} />)}
                            </ul>
                            <div className={style["cart-total"]}>
                                <div className={style["cart-total__title"]}>Total</div>
                                <div className={style["cart-total__amount"]}>{cart.length > 0 ? cart.map(product => product.quantité * product.prix).reduce((price, currValue) => price + currValue) : 0}€</div>
                            </div>
                            <hr />
                            {cart.length > 0 && (
                                <>
                                    <div className={style["payment-options"]}>
                                        <div className={style["payment-option"]}>
                                            <input type="radio" name="payment-option" id="credit-card" value="card" />
                                            <div className={style["credit-card-icon"]}>
                                                <img src={CreditCardIcon} alt="icône carte de crédit" />
                                            </div>
                                            <label htmlFor="credit-card">Débit ou Crédit</label>
                                        </div>
                                        <div className={style["payment-option"]}>
                                            <input type="radio" name="payment-option" id="cash" value="cash" />
                                            <div className={style["credit-card-icon"]}>
                                                <img src={CashIcon} alt="icône espèces" />
                                            </div>
                                            <label htmlFor="cash">En comptant</label>
                                        </div>
                                    </div>
                                    {formError && (<div className={style["error"]}>{formError}</div>)}
                                    <button className={style["order-button"]} type="submit">Commander</button>
                                </>
                            )}
                        </form>
                    )}
                </Modal>
            )}
        </>
    )
}
