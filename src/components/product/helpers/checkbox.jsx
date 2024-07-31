import PropTypes from 'prop-types';
import React from 'react';
import useStore from '../../../zustand/store';
import { useState } from 'react';

function CheckBox({ productObject, handleCart, moduleType }) {
  const removeFromStore = useStore((store) => store.removeFromStore);
  const addedProductIds = useStore((store) => store.addedProductIds);
  const removeTickboxFromStore = useStore((store) => store.removeTickboxFromStore);
  const addedProductIdsTickBox = useStore((store) => store.addedProductIdsTickBox);

  
  if(moduleType === "tickbox"){
    if (addedProductIdsTickBox.includes(productObject.ProductId)) {
      return <button aria-label="Remove" type="button" onClick={() => removeTickboxFromStore(productObject.ProductId)} className={`inc_product_add_checkbox_img ${addedProductIdsTickBox.includes(productObject.ProductId) ? 'checked' : 'uncheked'}`} />
    }
    return (
      <button aria-label="Add" type="button" onClick={() => handleCart(null, null, null, 'action', null, 'tickbox')} className={`inc_product_add_checkbox_img ${addedProductIdsTickBox.includes(productObject.ProductId) ? 'checked' : 'uncheked'}`} />
    );
  }else {
    if (addedProductIds.includes(productObject.ProductId)) {
      return <button aria-label="Remove" type="button" onClick={() => removeFromStore(productObject.ProductId)} className={`inc_product_add_checkbox_img ${addedProductIds.includes(productObject.ProductId) ? 'checked' : 'uncheked'}`} />
    }
    return (
      <button aria-label="Add" type="button" onClick={() => handleCart(null, null, null, 'action')} className={`inc_product_add_checkbox_img ${addedProductIds.includes(productObject.ProductId) ? 'checked' : 'uncheked'}`} />
    );
  }
}
CheckBox.propTypes = {
  handleCart: PropTypes.func.isRequired,
  productObject: PropTypes.object.isRequired,
  addedProductIds: PropTypes.array,
};

export default CheckBox;
