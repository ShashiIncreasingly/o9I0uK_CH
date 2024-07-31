import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Navigation,Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/swiper.min.css';
import Product from '../components/product';
import './styles/RecommendationPage.scss';

function RecommendationPage({ bundles }) {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const isBelow900 = useMediaQuery({ query: '(max-width: 1290px)' });
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });

  const swiperConfig = {
    sliderPerView: 4,
    freeMode: false,
  };

  if (isBelow900) {
    swiperConfig.sliderPerView = 3;
    swiperConfig.freeMode = true;
  }



  return (
    <div className="inc_recs_block">
      <div className="inc_af_title_block">
        <h3 className="inc_af_title_text_block">Best Selling Similar Products</h3>
      </div>
      <div className="inc_recs_bundles_block">
        {/* Swiper Carousel */}

        {/* Left Navigation */}
        {isMobileBelow ? (
          <div className="inc_af_bundle_product_block">
            {bundles.CategoryRecommendations
              && bundles.CategoryRecommendations.map(
                (product) => (
                  <Product key={product.ProductId} type="recs" productObject={product} main={false} />
                ),
              )}
          </div>
        ) : (
          <div className="inc_af_bundle_product_block">
            <div className="inc_af_bundle_nav_left" ref={(node) => setPrevEl(node)} />
            <Swiper
              spaceBetween={0}
              modules={[Navigation,Pagination]}
              slidesPerView={swiperConfig.sliderPerView}
              allowTouchMove={swiperConfig.freeMode}
              freeMode={swiperConfig.freeMode}
              navigation={{ prevEl, nextEl, disabledClass: 'inc_disabled' }}
            >
              {bundles.CategoryRecommendations
                && bundles.CategoryRecommendations.map(
                  (product) => (
                    <SwiperSlide key={product.ProductId}>
                      <Product type="recs" productObject={product} main={false} />
                    </SwiperSlide>
                  ),
                )}
            </Swiper>
            <div className="inc_af_bundle_nav_right" ref={(node) => setNextEl(node)} />
          </div>
        )}

        {/* Right Navigation */}


      </div>
    </div>
  );
}

// RecommendationPage.PropTypes.shape({
//   AssociatedProducts: React.PropTypes.array,
//   BundleCount: React.PropTypes.number.isRequired,
//   Bundles: React.PropTypes.any,
//   CategoryProducts: React.PropTypes.any,
//   CategoryRecommendations: React.PropTypes.arrayOf(React.PropTypes.shape({
//     Age: React.PropTypes.string.isRequired,
//     AltProdBundleDiscountPercentage: React.PropTypes.any,
//     AltProdBundleDiscountPrice: React.PropTypes.any,
//     AltProdBundleExclusiveVATBundlePrice: React.PropTypes.any,
//     AltProdBundleExclusiveVATDiscountPrice: React.PropTypes.any,
//     AltProdBundleExclusiveVATTotalPrice: React.PropTypes.any,
//     AltProdBundleExclusiveVATTotalSpecialPrice: React.PropTypes.any,
//     AltProdBundleLevelDiscountMessage: React.PropTypes.any,
//     AltProdBundlePrice: React.PropTypes.any,
//     AltProdBundleTotalPrice: React.PropTypes.any,
//     AltProdBundleTotalSpecialPrice: React.PropTypes.any,
//     Attributes: React.PropTypes.arrayOf(React.PropTypes.shape({
//       attributeCode: React.PropTypes.string.isRequired,
//       attributeId: React.PropTypes.string.isRequired,
//       attributeValues: React.PropTypes.arrayOf(React.PropTypes.shape({
//         childBundleLevelDiscountMessage: React.PropTypes.any,
//         childInternalProductId: React.PropTypes.number.isRequired,
//         childProductDescription: React.PropTypes.string.isRequired,
//         childProductField1: React.PropTypes.string.isRequired,
//         childProductField2: React.PropTypes.string.isRequired,
//         childProductField3: React.PropTypes.any,
//         childProductField4: React.PropTypes.string.isRequired,
//         childProductField5: React.PropTypes.any,
//         childProductField6: React.PropTypes.any,
//         childProductId: React.PropTypes.string.isRequired,
//         childProductImageUrl: React.PropTypes.string.isRequired,
//         childProductName: React.PropTypes.string.isRequired,
//         childProductOtherImageUrl: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
//         childProductPrice: React.PropTypes.string.isRequired,
//         childProductRating: React.PropTypes.any,
//         childProductRatingCount: React.PropTypes.any,
//         childProductSku: React.PropTypes.string.isRequired,
//         childProductSpecialPrice: React.PropTypes.string.isRequired,
//         childProductUrl: React.PropTypes.string.isRequired,
//         colorCode: React.PropTypes.any,
//         discountType: React.PropTypes.any,
//         exclusiveVATPrice: React.PropTypes.any,
//         exclusiveVATSpecialPrice: React.PropTypes.any,
//         genericField: React.PropTypes.any,
//         imageBgTransparentUrl: React.PropTypes.any,
//         optionId: React.PropTypes.string.isRequired,
//         optionImageUrl: React.PropTypes.string.isRequired,
//         optionText: React.PropTypes.string.isRequired,
//         pricingIsPercent: React.PropTypes.any,
//         pricingValue: React.PropTypes.any,
//         productLevelDiscountMessage: React.PropTypes.any,
//         productStatus: React.PropTypes.any,
//         promotionalMessage: React.PropTypes.string.isRequired,
//         quantity: React.PropTypes.any,
//         specialPricingValue: React.PropTypes.any,
//         volumeDiscountedPriceFlat: React.PropTypes.any,
//         volumeDiscountedPricePercentage: React.PropTypes.any,
//         volumeQuantity: React.PropTypes.any,
//         voucherCode: React.PropTypes.any,
//         voucherDiscountedPrice: React.PropTypes.any,
//       }).isRequired).isRequired,
//       frontEndLabel: React.PropTypes.string.isRequired,
//     }).isRequired).isRequired,
//     CategoryId: React.PropTypes.string.isRequired,
//     CategoryName: React.PropTypes.string.isRequired,
//     CategorySequenceId: React.PropTypes.any,
//     Color: React.PropTypes.string.isRequired,
//     Description: React.PropTypes.string.isRequired,
//     DiscountType: React.PropTypes.any,
//     ExclusiveVATPrice: React.PropTypes.any,
//     ExclusiveVATSpecialPrice: React.PropTypes.any,
//     Field1: React.PropTypes.string.isRequired,
//     Field2: React.PropTypes.string.isRequired,
//     Field3: React.PropTypes.string.isRequired,
//     Field4: React.PropTypes.string.isRequired,
//     Field5: React.PropTypes.string.isRequired,
//     Field6: React.PropTypes.string.isRequired,
//     FulfillmentType: React.PropTypes.any,
//     Gender: React.PropTypes.string.isRequired,
//     GenericField: React.PropTypes.any,
//     GuestsInfo: React.PropTypes.any,
//     HasAlternativeProducts: React.PropTypes.bool.isRequired,
//     ImageBgTransparentUrl: React.PropTypes.any,
//     ImageURL: React.PropTypes.string.isRequired,
//     InternalCategoryId: React.PropTypes.number.isRequired,
//     Manufacturer: React.PropTypes.string.isRequired,
//     OtherImageList: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
//     Price: React.PropTypes.string.isRequired,
//     ProductDealBundleLevelDiscountMessage: React.PropTypes.any,
//     ProductId: React.PropTypes.string.isRequired,
//     ProductLevelDiscountMessage: React.PropTypes.any,
//     ProductName: React.PropTypes.string.isRequired,
//     ProductSku: React.PropTypes.string.isRequired,
//     ProductStatus: React.PropTypes.any,
//     ProductType: React.PropTypes.string.isRequired,
//     ProductUrl: React.PropTypes.string.isRequired,
//     PromotionalMessage: React.PropTypes.string.isRequired,
//     Quantity: React.PropTypes.number.isRequired,
//     QuantityBasedBundle: React.PropTypes.any,
//     Rating: React.PropTypes.number.isRequired,
//     RatingCount: React.PropTypes.number.isRequired,
//     ShortDescription: React.PropTypes.string.isRequired,
//     Size: React.PropTypes.any,
//     SpecialPrice: React.PropTypes.any,
//     TotalOrders: React.PropTypes.number.isRequired,
//     VolumeDiscountedPriceFlat: React.PropTypes.any,
//     VolumeDiscountedPricePercentage: React.PropTypes.any,
//     VolumeQuantity: React.PropTypes.any,
//     VoucherCode: React.PropTypes.any,
//     VoucherDiscountedPrice: React.PropTypes.any,
//     Weight: React.PropTypes.any,
//     bundleProductItemDetails: React.PropTypes.any,
//   }).isRequired).isRequired,
//   Collections: React.PropTypes.any,
//   ComboSet: React.PropTypes.any,
//   ComboSetCount: React.PropTypes.number.isRequired,
//   FreeShippingSubTotal: React.PropTypes.number.isRequired,
//   FreeShippingTitle: React.PropTypes.string.isRequired,
//   HasClientRecommendations: React.PropTypes.bool.isRequired,
//   IsFreeShippingActive: React.PropTypes.bool.isRequired,
//   ProductDeals: React.PropTypes.any,
//   ProductsDetail: React.PropTypes.any,
//   RecsProductType: React.PropTypes.number.isRequired,
//   RedirectURL: React.PropTypes.any,
// }).isRequired;

export default RecommendationPage;
