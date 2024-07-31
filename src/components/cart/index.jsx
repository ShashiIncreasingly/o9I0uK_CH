import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { formatter } from '../../lib/helpers';
import useStore from '../../zustand/store';
import Tracking from '../../api/tracking';
import Loader from '../loader';
import './styles.scss';

function Cart() {
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
  const isMobileOpen = useStore((store) => store.isMobileOpen);

  const [cartText, setCartText] = useState('Item');

  if (!cart) {
    return <Loader />;
  }
  useEffect(() => {
    if (cart.length > 1) {
      setCartText('Items');
    } else {
      setCartText('Item');
    }
  }, [total]);

  useEffect(() => {
    if (addToCart && addedFrom === 'PDP') {
      window.location.href = '/cart';
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

  return (
    <div className="inc_pdp_simple_cart_block">

      <div className="inc_pdp_simple_cart_item">
        <div className="inc_pdp_simple_cart_item_text">
          {totalCartQuantity}
          {' '}
          {cartText}
        </div>
      </div>

      <div className="inc_pdp_bundle_cart_price">
        <div className="inc_pdp_bundle_cart_price_heading">Total Bundle Price</div>
        <div className="inc_pdp_bundle_cart_price_block">
          <div className="inc_pdp_bundle_cart_active">{formatter.format(total)}</div>
          <div className="inc_pdp_bundle_cart_saved">
            You Saved
            {' '}
            {formatter.format(saved)}
          </div>
        </div>
        <div className="inc_pdp_arrow_block" />
      </div>
      <button className={`inc_pdp_bundle_cart_button ${addToCartLoader ? 'inc_loading' : ''}`} onClick={() => handleAddToCart()}>{addToCartLoader ? 'Adding' : `Add ${totalCartQuantity} ${cartText} to Cart`}</button>
    </div>
  );
}

export default Cart;
