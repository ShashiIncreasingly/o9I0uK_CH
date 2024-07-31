import React from 'react';
import { bundleViewTracking } from '@/api/tracking';
import BundleCart from '@/components/bundlecart';
import Product from '@/components/product';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from 'react-responsive';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/swiper.min.css';
import '../styles/FBT.scss';
import { getCountryCode } from '@/lib/helpers';



function FBT({ bundles }) {

  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1290px)' });
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });

  const [bundleIds, setBundleIds] = useState({});

  const handleBundleIds = () => {
    const BundlesMapToIds = {};
    bundles.Bundles.map((bundle, index) => {
      if (index === 1) {
        BundlesMapToIds[bundle.ProductIds[0]] = bundle.BundleId;
        BundlesMapToIds[bundle.ProductIds[1]] = bundle.BundleId;
      } else {
        BundlesMapToIds[bundle.ProductIds[1]] = bundle.BundleId;
      }
    });
    setBundleIds(BundlesMapToIds);
  };

  const [ref, inView] = useInView({
    /* Optional options */
    triggerOnce: true,
    rootMargin: '0px 0px',
  });

  useEffect(() => {
    if (inView) {
      bundleViewTracking();
    }
  }, [inView === true]);

  useEffect(() => {
    handleBundleIds();
  }, []);

  return (
    <div className="inc_pdp_block incActive " ref={ref}>
      {/* Title Block */}
      <div className="inc_pdp_title_block">
        <div className="inc_pdp_title_text_block">
          <div className="inc_pdp_title_text">Goes well with...</div>
        </div>


        {/* {getCountryCode() === "o9I0TrauK" &&
          <div className="inc_pdp_promo ">
            <div className="inc_pdp_promo_text">
              <span>Spend £200</span> and get Nail Art Stickers, Dotting Tool and 2-Piece Acrylic Oval Brush. Use Code <span>OPINAILART</span>
            </div>
          </div>
        } */}
        {(getCountryCode() === "o9I0uK" || getCountryCode() === "o9I0TrauK") &&
          <div className="inc_pdp_promo ">
            <div className="inc_pdp_promo_text">
            <span>Free travel size nail polish</span> when you spend  <span>£25</span> with code : <span>FREEMINI</span>
            </div>
          </div>
        } 
         {/* <div className="inc_pdp_promo inc_pdp_promo_2 ">
          <div className="inc_pdp_promo_text">
          <span>Get a free mystery bundle </span> when you spend <span>£45+ </span> with code: <span>MYSTERY</span>
          </div>
        </div> */}
         {/* {getCountryCode() === "o9I0TrauK" && (<div className="inc_pdp_promo inc_pdp_promo_3 ">
          <div className="inc_pdp_promo_text">
          <span>Free bundle worth £60</span> when you <span>spend £200</span> with code <span>OPILEAP</span>
          </div>
        </div>)
        } */}



      </div>

      {/* Bundle Section */}
      <div className="inc_pdp_bundle_block">
        {/* Load First Product */}

        {/* Mobile Layout */}
        <Product type="pdp" blockType="main" productObject={bundles.ProductsDetail[0]} main />

        {/* Plus Icon */}
        <div className="inc_pdp_icon-add_block">
          <div className="inc_pdp_icon-add_img_block" />
        </div>

        {/* Swiper Carousel */}
        <div className="inc_pdp_bundle_product_block">
          {/* Left Navigation */}
          <span className="inc_bundle_title_text">Frequently bought with</span>
          {isMobileBelow ? (
            <div>
              {bundles.ProductsDetail
                && bundles.ProductsDetail.slice(1, 3).map((product, idx) => (
                  <Product type="pdp" productObject={product} key={product.ProductId} main={false} idx={idx} />
                ))}
            </div>
          ) : (
            <>
              <div className="inc_pdp_bundle_nav_left" ref={(node) => setPrevEl(node)} />
              <Swiper
                spaceBetween={10}
                modules={[Navigation]}
                slidesPerView={isTabletOrMobile ? 1 : 2}
                allowTouchMove={false}
                navigation={{ prevEl, nextEl, disabledClass: 'inc_disabled' }}
              >
                {bundles.ProductsDetail
                  && bundles.ProductsDetail.slice(1).map((product, idx) => (
                    <SwiperSlide key={product.ProductId}>
                      <Product
                        type="pdp"
                        productObject={product}
                        main={false}
                        bundleIds={bundleIds}
                        idx={idx}
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
              {/* Right Navigation */}
              <div className="inc_pdp_bundle_nav_right" ref={(node) => setNextEl(node)} />
            </>
          )}
        </div>

        {/* Cart Block */}
        <BundleCart />
      </div>
    </div>
  );
}

FBT.propTypes = {
  bundles: PropTypes.object.isRequired,
};

export default FBT;
