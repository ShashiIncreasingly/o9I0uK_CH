import React, { useEffect, useRef, useState } from 'react';

import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useMediaQuery } from 'react-responsive';
import useStore from '../zustand/store';
import 'swiper/swiper-bundle.css';
import 'swiper/swiper.min.css';
import Product from '../components/product';
import { getCartPageProductIds, readCookieValue } from '../lib/helpers';
import './styles/CartPage.scss';
import Loader from '../components/loader';
import { irbReqCart } from '../api/irb';

function CartPage() {
  const fetchBundle = useStore((store) => store.fetchBundle);
  const cartBundles = useStore((store) => store.cartBundles);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const cartExist = useStore((store) => store.cartExist);
  const isBelow1280 = useMediaQuery({ query: '(max-width: 1280px)' });
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });

  useEffect(() => {
    let url;
    const ENV = window.location.host === '127.0.0.1:5173' ? 'development' : url;
    const productIDS = getCartPageProductIds(ENV);
    const ivid = readCookieValue('ivid');
    if (ENV !== 'development') {
      url = irbReqCart(productIDS, ivid);
      fetchBundle(url, 'cart');
    } else {
      fetchBundle('development', 'cart');
    }
  }, []);

  const swiperConfig = {
    sliderPerView: 4,
    freeMode: false,

  };

  if (isBelow1280) {
    swiperConfig.sliderPerView = 3.5;
    swiperConfig.freeMode = true;
  }

  if (!cartExist) {
    return <Loader />;
  }
  return (
    <div className="inc_af_block inc_af_cart_page">
      <div className="inc_af_title_block">
        <h3 className="inc_af_title_text_block">Customers also Bought</h3>
      </div>
      <div className="inc_af_bundles_block">
        {/* Swiper Carousel */}

        {/* Left Navigation */}

        {isMobileBelow ? (
          <div className="inc_af_bundle_product_block">
            {cartBundles.ProductsDetail
              && cartBundles.ProductsDetail.map(
                (product) => (
                  <Product type="cart" productObject={product} main={false} />
                ),
              )}
          </div>
        ) : (
          <div className="inc_af_bundle_product_block">
            {' '}
            <div className="inc_af_bundle_nav_left" ref={(node) => setPrevEl(node)} />
            <Swiper
              spaceBetween={0}
              modules={[Navigation]}
              slidesPerView={swiperConfig.sliderPerView}
              allowTouchMove={swiperConfig.freeMode}
              freeMode={swiperConfig.freeMode}
              navigation={{ prevEl, nextEl, disabledClass: 'inc_disabled' }}

            >
              {cartBundles.ProductsDetail
                && cartBundles.ProductsDetail.map(
                  (product, idx) => (
                    <SwiperSlide key={idx}>
                      <Product type="cart" productObject={product} main={false} />
                    </SwiperSlide>
                  ),
                )}
            </Swiper>
            {' '}
            <div className="inc_af_bundle_nav_right" ref={(node) => setNextEl(node)} />
          </div>
        )}

        {/* Right Navigation */}


      </div>
    </div>
  );
}

export default CartPage;
