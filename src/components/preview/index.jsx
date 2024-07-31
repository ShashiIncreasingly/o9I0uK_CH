import React from 'react';
import propTypes from 'prop-types';
import './styles.scss';
import tracking from '@/api/tracking';
import { getProductIdFromWebPage } from '@/lib/helpers';

function scrollToTargetAdjusted(target) {
  var element = target
  var headerOffset = 60;
  var elementPosition = element.getBoundingClientRect().top;
  var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });
}

function Preview({ bundles }) {
  const firstProduct = bundles.ProductsDetail[0];
  const secondProduct = bundles.ProductsDetail[1];
  const thirdProduct = bundles.ProductsDetail[2];



  const handleClickScroll = () => {
    const element = document.querySelector('.inc_pdp_block');
    if (element) {
      let productId = getProductIdFromWebPage()
      
      tracking.sendBundleClickTracking(productId[0],210)
      scrollToTargetAdjusted(element)

    }
  };
  return (
    <div className="inc_bundle_avail_block">
      <div className="img_wrapper">
        {firstProduct && (
          <div className="inc_bundle_avail_img first">
            <img src={firstProduct.ImageURL} alt={firstProduct.ProductName} />
          </div>
        )}

        {secondProduct && (
          <> <div className="inc_bundle_plus" />
            <div className="inc_bundle_avail_img second">
              <img src={secondProduct.ImageURL} alt={secondProduct.ProductName} />
            </div></>

        )}
        {thirdProduct && (
          <> <div className="inc_bundle_plus" />
            <div className="inc_bundle_avail_img third">
              <img src={thirdProduct.ImageURL} alt={thirdProduct.ProductName} />
            </div></>

        )}
      </div>
      <div className="inc_bundle_avail_btn" onClick={() => handleClickScroll()}>Bundle Available</div>
    </div>
  );
}
Preview.propTypes = {
  bundles: propTypes.object.isRequired,
}

export default Preview;
