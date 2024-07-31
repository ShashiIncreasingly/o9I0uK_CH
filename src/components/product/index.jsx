import cloneDeep from 'lodash/cloneDeep';
import first from 'lodash/first';
import intersection from 'lodash/intersection';
import intersectionBy from 'lodash/intersectionBy';
import uniqBy from 'lodash/uniqBy';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { getCountryCode, handleFallbackImage, sortArray } from '../../lib/helpers';
import useStore from '../../zustand/store';
import Ratings from '../atoms/Ratings';
import ModalBlock from '../modal';
import Price from '../price';
import CheckBox from './helpers/checkbox';
import './product.scss';
import tracking from '@/api/tracking';

function Promo({ main, productId }) {
  let promoIdsConsumer = [];
  let promoIdsPro = [
    '99399000443',
    '99399000491',
    '99399000444',
    '99399000492',
    '99399000473',
    '99399000438',
    '99399000486',
    '99399000470',
    '99399000469',
    '99399000471',
    '99399000446',
    '99399000494',
    '99399000475',
    '99399000474',
    '99399000437',
    '99399000485',
    '99399000445',
    '99399000493',
    '99399000439',
    '99399000487',
    '99399000467',
    '99399000448',
    '99399000496',
    '99399000472',
    '99350170947',
    '99350170949',
    '99350170951',
    '99350170946',
    '99350170941',
    '99350170937',
    '99350170939',
    '99350170936',
    '99399000468',
    '99399000441',
    '99399000489',
    '99399000447',
    '99399000495',
    '99399000442',
    '99399000490',
    '99399000440',
    '99399000488'
  ];
  let excludepromos = ['99350103829','99399000475','99399000490','99399000474','99350170939','99350170941','99399000491','99399000471','99399000487','99399000470','99399000493','99399000473','99399000486','99399000489','99399000494','99399000469','99399000492','99399000495','99399000485','99399000467','99399000496','99399000472','99399000446','99399000437','99399000445','99399000448','99399000438','99399000444','99399000439','99399000441','99399000443','99399000440','99399000442','99399000447','99350170947','99350170951','99350170946','99350170949','99399000521','99399000529','99399000575','99399000572','99399000571','99399000569','99350171422','99399000576','99350171417','99399000527','99399000573','99350171423','99350171425','99399000522','99350171416','99399000566','99399000523','99399000520','99399000528','99399000526','99399000521','99399000531','99399000525','99399000530','99399000577','99350171414','99399000570','99399000524','99399000568','99399000574']

  let key = getCountryCode();

  // if (key === "o9I0TrauK" && productId.toString() == "99350103829") {
  //   return (
  //     <div className="inc_product_desc_promo">
  //       <div className="inc_product_desc_promo_text">
  //       <span>20% OFF OPI STAR LIGHT GEL LAMP</span>
  //       </div>
  //     </div>
  //   )
  // }

  if (
    !promoIdsConsumer.includes(productId.toString()) &&
    !promoIdsPro.includes(productId.toString()) && excludepromos.includes(productId.toString())
  ) {
    return <div className="inc_product_desc_promo empty"></div>;
  }

  if (key === 'o9I0uK' && promoIdsConsumer.includes(productId)) {
    return (
      <div className="inc_product_desc_promo">
        <div className="inc_product_desc_promo_text">
          <span>Spend £45 and get 20% off</span> your order with code <span>OPI20</span>, or{' '}
          <span>spend £55 and get 25% off</span> your order with code <span>OPI25.</span>
        </div>
      </div>
    );
  }

  // if (!excludepromos.includes(productId)) {
  //   return (
  //     <div className="inc_product_desc_promo">
  //       <div className="inc_product_desc_promo_text">
  //         <span>Spend £45</span> and get 20% off your order with code{' '}
  //         <span>SUMMER20</span> 
  //         <span className='or_promo'>or</span>
  //       </div>
  //       <div className="inc_product_desc_promo_text inc_product_desc_promo_text_2">
  //         <span>spend £55</span> and get 25% off with code{' '}
  //         <span>SUMMER25</span>
  //       </div>
  //     </div>
  //   );
  // }

  return <div className="inc_product_desc_promo empty"></div>;
}

function Product({ productObject, main, type, bundleIds, idx }) {
  const { ProductName, ProductType, Attributes } = productObject;

  // States
  const [activeAttributes, setActiveAttributes] = useState(null);
  const [activeOptions, setActiveOptions] = useState({});
  const [activeMainImage, setActiveMainImage] = useState(productObject.ImageURL);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState({
    activePrice: Number(productObject.Price),
    specialPrice: Number(productObject.SpecialPrice)
  });
  const [activeID, setActiveId] = useState(null);
  const [qty, setQty] = useState(1);
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });
  const [mini, setMini] = useState(isMobileBelow);

  // Store Call
  const addedProductIds = useStore((store) => store.addedProductIds);
  const addToStore = useStore((store) => store.addToStore);
  const addTickboxToStore = useStore((store) => store.addTickboxToStore);
  const cart = useStore((store) => store.cart);
  const failedCartId = useStore((store) => store.failedCartId);
  const failedCartIds = useStore((store) => store.failedCartIds);

  const handleCart = (activePrice, specialPrice, quantity, source, activeIDFromSource, moduleType) => {
    
    if (!addedProductIds.includes(productObject.ProductId) && source !== 'action' && moduleType !== "tickbox") return;
    let updatedActivePrice = activePrice;
    let updatedSpecialPrice = specialPrice;
    const updatedQty = quantity || qty;
    if (!activePrice && !specialPrice) {
      updatedActivePrice = price.activePrice;
      updatedSpecialPrice = price.specialPrice;
    }
    const updatedProduct = {};
    updatedProduct.ProductId = productObject.ProductId;
    updatedProduct.Price = updatedActivePrice;
    updatedProduct.SpecialPrice = updatedSpecialPrice;
    updatedProduct.ImageURL = productObject.ImageURL;
    updatedProduct.ProductName = productObject.ProductName;
    updatedProduct.Field1 = productObject.Field1;

    const currentActiveID = activeIDFromSource || activeID;
    if(moduleType === "tickbox"){
      addTickboxToStore(updatedProduct, updatedQty, currentActiveID);
    }else{
      addToStore(updatedProduct, updatedQty, currentActiveID);
    }
    
  };

  function handleAttributes(attributes, currentID, currentText, index, label) {
    // Lets Handle From Top
    // Using Text Get Active Values
    const computedAttributes = [];
    let updatedActiveOption = {};
    updatedActiveOption[label] = currentText;
    // Except First Prepare All Based On The Other
    // Get All Active IDS From First Attribute To Keep It Same
    let allProductIds = [];
    const allPreviousProductIds = [];
    const firstAttributeName = attributes[0].attributeCode;
    if (index === 0) {
      cloneDeep(attributes)[0].attributeValues.filter(
        (childProduct) =>
          childProduct.optionText === currentText && allProductIds.push(childProduct.childProductId)
      );
    } else {
      cloneDeep(attributes)[0].attributeValues.filter(
        (childProduct) =>
          childProduct.optionText === activeOptions[firstAttributeName] &&
          allPreviousProductIds.push(childProduct.childProductId)
      );
    }

    const uniqueFirstAttributes = uniqBy(attributes[0].attributeValues, (o) => o.optionText);
    const updatedAttribute = attributes[0];
    updatedAttribute.attributeValues = uniqueFirstAttributes;
    computedAttributes.push(attributes[0]);

    // Now Loop Through Other Attributes With This ID
    cloneDeep(attributes)
      .slice(1)
      .map((product, cloneIDX) => {
        // Get All Products With Respect To First ID
        let syncedProducts = product;
        let uniqueSubAttributes = null;
        let updatedProduct = product;
        if (allProductIds.length === 0) {
          syncedProducts = product.attributeValues.filter(
            (childProduct) =>
              childProduct.optionText === currentText &&
              allProductIds.push(childProduct.childProductId)
          );

          updatedProduct = activeAttributes[cloneIDX + 1];
        } else {
          // Get Inital IDS

          // If Not First Will Get The IDS from First As Well
          const updatedActiveIdsToTest = intersection(allProductIds, allPreviousProductIds);
          if (updatedActiveIdsToTest.length === 0) {
            syncedProducts = product.attributeValues.filter((childProduct) =>
              allProductIds.includes(childProduct.childProductId)
            );
          } else {
            syncedProducts = product.attributeValues.filter((childProduct) =>
              updatedActiveIdsToTest.includes(childProduct.childProductId)
            );
          }

          // Set One Active Value
          const findAlreadyActive = syncedProducts.find(
            (prd) => activeOptions[product.attributeCode] === prd.optionText
          );
          if (findAlreadyActive) {
            updatedActiveOption[product.attributeCode] = findAlreadyActive.optionText;
          } else {
            updatedActiveOption[product.attributeCode] = first(syncedProducts).optionText;
          }
          // Set Active IDS Of Selected Product
          const allChildProductIDS = [];

          product.attributeValues.filter(
            (childProduct) =>
              childProduct.optionText === updatedActiveOption[product.attributeCode] &&
              allChildProductIDS.push(childProduct.childProductId)
          );
          allProductIds = intersection(allChildProductIDS, allProductIds);
          uniqueSubAttributes = uniqBy(syncedProducts, (o) => o.optionText);
          updatedProduct.attributeValues = uniqueSubAttributes;
        }

        return computedAttributes.push(updatedProduct);
      });

    updatedActiveOption = { ...activeOptions, ...updatedActiveOption };
    // Set Correct Active Price & Image With ChildProduct which contains all the active IDS
    const sameOptions = [];
    const clonedForOptions = cloneDeep(Attributes);
    Object.keys(updatedActiveOption).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(updatedActiveOption, key)) {
        const foundChild = clonedForOptions
          .find((child) => child.attributeCode === key)
          .attributeValues.filter((subchild) => subchild.optionText === updatedActiveOption[key]);
        sameOptions.push(foundChild);
      }
    });

    const currentActive = intersectionBy(...sameOptions, 'childProductId')[0];

    setActiveMainImage(currentActive.optionImageUrl);
    // Set ActivePrice
    const activePrice = currentActive.childProductPrice;
    const specialPrice = currentActive.childProductSpecialPrice;

    // Update State
    setPrice({
      activePrice: Number(activePrice),
      specialPrice: Number(specialPrice)
    });

    setActiveOptions({ ...updatedActiveOption });
    setActiveId(currentActive.childProductId);
    // Update Cart
    handleCart(activePrice, specialPrice, null, 'attributes', currentActive.childProductId);

    return computedAttributes;
  }

  // Delayed Tracking Click
  const sendClickTrackDelayed = (ProductId, ProductUrl) => {
    tracking.sendBundleClickTracking(ProductId, 100);
    
    setTimeout(() => {
      window.location.href = `${ProductUrl}`;
    }, 1000);
  };

  const updateActiveAttribute = (currentID, currentText, index, uuid, label, combo) => {
    // Create Deep Clone
    let shadowProduct = cloneDeep(productObject.Attributes);
    shadowProduct = sortArray(shadowProduct);
    const computed = handleAttributes(shadowProduct, currentID, currentText, index, label);

    setActiveAttributes(computed);
    setActiveId(currentID);
  };

  const handleOpen = (source, state) => {
    if (type === 'recs') {
      sendClickTrackDelayed(
        productObject.ProductId,
        productObject.ProductUrl.replace('https://www.opi.com', window.location.origin)
      );
    }
    if (type === 'recs') return;
    setIsOpen(state);

    if (isMobileBelow && (type === 'pdp' || type === 'tickbox')) {
      if (source === 'title' || source === 'image') {
        setMini(false);
      } else {
        setMini(true);
      }
    }
    if (isMobileBelow && type !== 'pdp' && type !== 'tickbox') {
      setMini(false);
    }
  };

  // Use Effect Re-Render Entire Component
  useEffect(() => {
    // Create Deep Clone
    const deepClone = cloneDeep(productObject);
    let computed = null;
    if (productObject.ProductType !== 'simple') {
      deepClone.Attributes = sortArray(deepClone.Attributes);
      const currentID = deepClone.Attributes[0].attributeValues[0].childProductId;
      const currentText = deepClone.Attributes[0].attributeValues[0].optionText;
      const label = deepClone.Attributes[0].frontEndLabel;

      computed = handleAttributes(
        deepClone.Attributes,
        currentID,
        currentText,
        0,
        label,
        'initial'
      );
    }

    if (computed !== null) {
      setActiveAttributes(computed);
    }
  }, []);

  let currentBundleId = '';
  if (bundleIds) {
    currentBundleId = bundleIds[productObject.ProductId];
  }

  useEffect(() => {
    if (cart.length === 0 && main) {
      addToStore(productObject, qty);
    }
  }, [cart.length]);

  return (
    <div
      className="inc_product_showcase_block"
      role="contentinfo"
      data-key={productObject.ProductId}
      data-productid={productObject.ProductId}
      data-bundleid={currentBundleId}>
      <span className="inc_bundle_main_title_text">{main && 'This item'}</span>
      <div className={`inc_product_block ${ProductType} ${type}`}>
        <div className="inc_product_info_main_block">
          <div className="inc_product_img_block">
            {productObject.PromotionalMessage !== null &&
              productObject.PromotionalMessage !== '' && (
                <div
                  className={`inc_product_promotional_message ${
                    productObject.PromotionalMessage === 'Sale'
                      ? 'inc_sale_promo'
                      : 'inc_general_promo'
                  } ${productObject.PromotionalMessage === 'Pro Only' && 'inc_pro_only_promo'}`}>
                  {productObject.PromotionalMessage}
                </div>
              )}
             {(type === 'pdp' || type === 'tickbox') && <CheckBox handleCart={handleCart} productObject={productObject} moduleType={type}/>}

            <div className="inc_product_img_main_block">
              <a
                href={productObject.ProductUrl.replace(
                  'https://www.opi.com',
                  window.location.origin
                )}
                onClick={(e) => e.preventDefault()}>
                <div
                  className="inc_product_img_main_img"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpen('image', true)}
                  onKeyDown={() => handleOpen('image', true)}>
                  <img
                    onError={(e) => handleFallbackImage(e)}
                    src={activeMainImage}
                    alt=""
                    className="inc_product_main_img_img"
                  />
                </div>
              </a>
            </div>
          </div>

          <div className="inc_product_desc_block">
            <div className="inc_product_desc_manufacturer">{productObject.CategoryName}</div>
            <div className="inc_product_desc_title_block">
              <div className="inc_product_desc_title_text_block">
                <div
                  tabIndex={0}
                  role="button"
                  onClick={() => handleOpen('title', true)}
                  onKeyDown={() => handleOpen('title', true)}>
                  <a href={productObject.ProductUrl} onClick={(e) => e.preventDefault()}>
                    <p className="inc_product_desc_title_text" title={ProductName}>
                      {ProductName}
                    </p>
                  </a>
                </div>
              </div>
            </div>

            <Price activePrice={price.activePrice} specialPrice={price.specialPrice} />
            <Ratings
              rating={productObject.Rating}
              ratingCount={productObject.RatingCount}
              type="productObject"
            />

            <Promo main={main} productId={productObject.ProductId} />

            <ModalBlock
              type={type}
              productObject={productObject}
              key={productObject.ProductId}
              activeAttributes={activeAttributes}
              price={price}
              activeMainImage={activeMainImage}
              activeOptions={activeOptions}
              updateActiveAttribute={updateActiveAttribute}
              main={main}
              attributeType="simple"
              qty={qty}
              setQty={setQty}
              handleCart={handleCart}
              activeID={activeID}
              modalIsOpen={modalIsOpen}
              setIsOpen={setIsOpen}
              mini={mini}
              handleOpen={handleOpen}
            />
            <span className={`inc_error ${failedCartId == productObject.ProductId && 'inc_show'}`}>
              *PRODUCT NOT ADDED TO CART
            </span>
            <span
              className={`inc_error ${
                failedCartIds.includes(productObject.ProductId) && 'inc_show'
              }`}>
              *PRODUCT NOT ADDED TO CART
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

Product.propTypes = {
  productObject: PropTypes.object.isRequired,
  main: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  bundleIds: PropTypes.object
};

export default Product;
