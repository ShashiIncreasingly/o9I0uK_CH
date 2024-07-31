import React, { useEffect, useState } from 'react';
import Tracking from '../../api/tracking';
import { formatter, handleFallbackImage } from '../../lib/helpers';
import useStore from '../../zustand/store';
import Loader from '../loader';
import './styles.scss';
import { useMediaQuery } from 'react-responsive';

const getPrice = (active, special) => (special !== null && special !== 0 ? special : active);

function BundleCart() {
  const cart = useStore((store) => store.cart);
  const total = useStore((store) => store.total);
  const totalCartQuantity = useStore((store) => store.totalCartQuantity);
  const saved = useStore((store) => store.saved);
  const addToClient = useStore((store) => store.addToClient);
  const addToCartLoader = useStore((store) => store.addToCartLoader);
  const addToCart = useStore((store) => store.addToCart);
  const addedFrom = useStore((store) => store.addedFrom);
  const addedProductIds = useStore((store) => store.addedProductIds);
  const bundles = useStore((store) => store.bundles);
  const removeFromStore = useStore((store) => store.removeFromStore);
  const handleClientMiniCart = useStore((store) => store.handleClientMiniCart);
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });
  if (!cart) {
    return <Loader />;
  }

  useEffect(() => {
    if (addToCart && addedFrom === 'PDP') {
      // OPEN CLIENT MODAL
      // const clientSidebar = document.querySelector('[data-test-id="siteHeaderCart"]');
      // if (clientSidebar) {
      //   clientSidebar.click();
      //   setTimeout(() => {
      //     handleClientMiniCart();
      //   }, 500);
      // } else {
      //   // console.log("Something happend try again!")
      // }
    }
  }, [addToCart]);

  const handleAddToCart = () => {
    if (addToCartLoader === false) {
      Tracking.addToCartTracking(
        bundles.ProductsDetail[0].ProductId,
        cart[0].ProductId,
        addedProductIds,
        bundles,
        'multiple',
      );
      addToClient(cart);
    }
  };

  

  const getTotalText = () => {
    let buttonText = 'Add To Bag';
    if (totalCartQuantity === 1) {
      buttonText = 'Add To Bag';
    } else if (totalCartQuantity === 2) {
      buttonText = 'Add Both To Bag';
    } else if (totalCartQuantity === 3) {
      buttonText = 'Add All Three To Bag';
    } else if (totalCartQuantity === 4) {
      buttonText = 'Add All Four To Bag';
    } else if (totalCartQuantity === 5) {
      buttonText = 'Add All Five To Bag';
    } else if (totalCartQuantity === 6) {
      buttonText = 'Add All Six To Bag';
    }

    return buttonText;
  };

  return (
    <div className="inc_pdp_bundle_cart_block">
      <div className="inc_pdp_bundle_cart_title_block">
        <div className="inc_pdp_bundle_cart_title_text">Price summary</div>
      </div>
      <div className="inc_pdp_bundle_cart_added_block">
        {cart.map((product) => (
          <div className="inc_pdp_bundle_cart_added_product_block" key={product.ProductId}>
            <div className="inc_pdp_bundle_cart_added_product_img_block">
              <div className="inc_pdp_bundle_cart_added_product_img">
                <img
                  src={product.ImageURL}
                  onError={(e) => handleFallbackImage(e)}
                  alt={product.ProductName}
                />
              </div>
            </div>
            <div className="inc_pdp_bundle_cart_added_product_title_block">
              <div className="inc_pdp_bundle_cart_added_product_title_text_block">
                <div className="inc_pdp_bundle_cart_added_product_title_text">
                  <p title={product.ProductName}>
                    <span>
                      {product.qtyAdded}
                      x
                      {product.ProductName}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="inc_pdp_bundle_cart_added_product_price_block">
              <div className="inc_pdp_bundle_cart_added_product_price_text_block">
                <div className="inc_pdp_bundle_cart_added_product_price_text">{formatter.format(getPrice(product.Price, product.SpecialPrice) * product.qtyAdded)}</div>
              </div>
            </div>

            <div className="inc_pdp_bundle_cart_added_product_close_icon"  onClick={() => removeFromStore(product.ProductId)} />

          </div>
        ))}

      </div>

      <div className="inc_pdp_bundle_cart_price">
        <div className="inc_pdp_bundle_cart_price_heading">{isMobileBelow ? "Total price:" : "Total Price"}</div>
        <div className="inc_pdp_bundle_cart_price_block">
          <div className="inc_pdp_bundle_cart_active">{formatter.format(total)}</div>
          {saved !== 0
            && (
              <div className="inc_pdp_bundle_cart_saved">
                You Save
                {' '}
                {formatter.format(saved)}
              </div>
            )}

        </div>
        <div className="inc_pdp_arrow_block" />
      </div>
      <button disabled={addToCartLoader} type="button" className={`inc_pdp_bundle_cart_button ${addToCartLoader ? 'inc_loading' : ''}`} onClick={() => handleAddToCart()}>{getTotalText()}</button>
    </div>
  );
}

export default BundleCart;
