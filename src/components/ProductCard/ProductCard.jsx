import style from './ProductCard.module.css'
import Modal from '../Modal/Modal';
import { useState, useEffect } from 'react'
import OptionInput from '../OptionInput/OptionInput';
import QuantitySelector from '../QuantitySelector/QuantitySelector';
import NotFound from "../NotFound/NotFound"

export default function ProductCard({ productDetails, addToCart, cart, selectedCategory }) {
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [formError, setFormError] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [allergens, setAllergens] = useState([]);
  const productUniqueOptions = Object.keys(productDetails.options.unique);
  const productMultipleOptions = productDetails.options.multiple ? Object.keys(productDetails.options.multiple) : [];
  const productOptions = [...productUniqueOptions, ...productMultipleOptions];

  useEffect(() => {
    setFormError("");
    setValidationMessage("");
    setAllergens([]);
    setProductQuantity(1);
  }, [showProductDetails])

  const addProductToCart = (e) => {
    e.preventDefault();

    const options = {};
    const missingFields = [];

    const selectedValues = productOptions.map(option => e.target[option].length > 0 ? [...e.target[option]] : [e.target[option]]).map(inputArr => inputArr.filter(input => input.checked).map(checkedInput => checkedInput.value));
    selectedValues.forEach((value, i) => options[productOptions[i]] = value);

    for (const key in options) {
      if (productDetails.options.unique.hasOwnProperty(key) && options[key].length === 0) {
        missingFields.push(key)
      }
    }

    if (missingFields.length > 0) {
      e.target.scrollTop = 0;
      setFormError(`Veuillez remplir ${missingFields.length > 1 ? `les champs ${missingFields.map((field, i) => i === missingFields.length - 1 ? `et "${field}"` : `"${field}"`).join(", ")}.` : `le champ "${missingFields[0]}".`}`);
      return;
    }

    setFormError("");
    setValidationMessage("");

    const productIndex = cart.findIndex(product => product.id === productDetails.id && JSON.stringify(product.options) === JSON.stringify(options))

    if (productIndex !== -1) {
      const newCart = [...cart];
      newCart.splice(productIndex, 1, { ...cart[productIndex], quantit??: productQuantity });
      e.target.scrollTop = 0;
      setValidationMessage(`La quantit?? du ${productDetails.nom} a bien ??t?? modifi??e.`);
      addToCart(newCart);
      return
    }

    let price;

    if (productDetails.prix) {
      price = productDetails.prix;
    } else {
      price = productDetails.options.unique.taille.find(obj => obj.nom === options.taille[0]).prix;
    }

    let extrasPrices = [];

    if (options.extras.length > 0) {
      extrasPrices = options.extras.map(extra => productDetails.options.multiple.extras.find(obj => obj.nom === extra).prix);
      price = [price, ...extrasPrices].reduce((price, currValue) => price + currValue);
    }

    e.target.scrollTop = 0;
    setValidationMessage(`${productQuantity} ${productDetails.nom} ${productQuantity > 1 ? "ont ??t?? ajout??s au panier" : "a ??t?? ajout?? au panier"}.`);
    addToCart([...cart, { ...productDetails, options: options, quantit??: productQuantity, prix: price, "prix des extras": extrasPrices }])
  };

  return (
    <>
      <div onClick={() => setShowProductDetails(true)} className={style["product-card"]}>
        {!productDetails.disponibilit?? && (
          <div className={style["product-unavailable"]}>
            Indisponible
          </div>
        )}
        <div className={style["product-image"]}>
          <img src={productDetails.image} alt={`image ${productDetails.nom}`} />
        </div>
        <div className={style["product-name"]}>
          {productDetails.nom}
        </div>
      </div>
      {showProductDetails && (
        <Modal setShowModal={setShowProductDetails}>
          {productDetails.disponibilit?? ?
            (<form
              onSubmit={addProductToCart} className={style["product-details-form"]}>
              {formError && (<div className={style["error"]}>{formError}</div>)}
              {validationMessage && (<div className={style["validation"]}>{validationMessage}</div>)}
              <div className={style["product-details-image"]}>
                <img src={productDetails.image} alt={`image de ${productDetails.nom}`} />
              </div>
              <div className={style["product-details-name"]}>{productDetails.nom}</div>
              <div className={style["product-details-description"]}>{productDetails.description}</div>
              {productDetails.prix && (
                <div className={style["product-details-price"]}>
                  <div className={style["product-details-price__title"]}>Prix :</div>
                  <div className={style["product-details-price__name"]}>{productDetails.prix.toFixed(2)}???</div>
                </div>
              )}
              <div className={style["product-details-type"]}>
                <div className={style["product-details-type__title"]}>{selectedCategory.category === "boissons" ? "Base" : "Viande"}</div>
                <div className={style["product-details-type__name"]}>
                  <OptionInput id={productDetails.type} name={productDetails.type} value={productDetails.type} isActive={true} />
                </div>
              </div>
              {selectedCategory.category === "nourriture" && (
                <div className={style["product-details-regime"]}>
                  <div className={style["product-details-regime__title"]}>R??gime :</div>
                  <div className={style["product-details-regime__name"]}>{productDetails.r??gime.join(", ")}</div>
                </div>
              )}
              <div className={style["product-options"]}>
                {productUniqueOptions.map((option, i) => (
                  <div key={i} className={style["product-option-container"]}>
                    <div className={style["product-option-name"]}>{option} <span>*</span>: </div>
                    <div className={style["product-option-inputs"]}>{productDetails.options.unique[option].map((optionValue, i) => typeof optionValue === "object" ?
                      <OptionInput key={i} id={`${option}-option-${i}`} name={option} value={optionValue.nom} price={optionValue.prix} />
                      :
                      <OptionInput key={i} id={`${option}-option-${i}`} name={option} value={optionValue} onSelectOption={() => {
                        if(productDetails.allerg??nes && productDetails.allerg??nes[optionValue.toLowerCase()]) {
                          setAllergens(productDetails.allerg??nes[optionValue.toLowerCase()]);
                          return
                        }

                        setAllergens([])
                      }}/>
                    )}
                    </div>
                  </div>))}
              </div>
              <div className={style["product-options"]}>
                {productMultipleOptions.map((option, i) => (
                  <div key={i} className={style["product-option-container"]}>
                    <div className={style["product-option-name"]}>{option} : </div>
                    <div className={style["product-option-inputs"]}>{productDetails.options.multiple[option].map((optionValue, i) => typeof optionValue === "object" ?
                      <OptionInput key={i} id={`${option}-option-${i}`} name={option} value={optionValue.nom} price={optionValue.prix} extra={option === "extras"} multiple />
                      :
                      <OptionInput key={i} id={`${option}-option-${i}`} name={option} value={optionValue} multiple />
                    )}
                    </div>
                  </div>))}
              </div>
              {productDetails.allerg??nes && (
                <div className={style["product-details-allergens"]}>
                  <div className={style["product-details-allergens__title"]}>Allerg??nes</div>
                  <ul className={style["product-details-allergens"]}>{typeof productDetails.allerg??nes === 'object' && productDetails.allerg??nes !== null && !Array.isArray(productDetails.allerg??nes) ? allergens.map((allergen, i) => <li key={i}>{allergen}</li>) : productDetails.allerg??nes.map((allergen, i) => <li key={i}>{allergen}</li>)}</ul>
                </div>
              )}
              <div className={style["product-details-quantity"]}>
                <QuantitySelector quantity={productQuantity} setQuantity={setProductQuantity} />
              </div>
              <button className={style["add-cart-button"]} type="submit">
                Ajouter
              </button>
            </form>)
            :
            <NotFound productName={productDetails.nom} />}
        </Modal>
      )}
    </>
  )
}
