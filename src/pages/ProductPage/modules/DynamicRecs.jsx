import { bundleViewTracking } from '@/api/tracking';
import Product from '@/components/product';
import useStore from '@/zustand/store';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import '../styles/DynamicRecs.scss';
import { Navigation, Scrollbar } from 'swiper/swiper.esm.js';
import 'swiper/swiper.min.css';
import 'swiper/css/scrollbar';
import { getCountryCode } from '@/lib/helpers';

function DynamicRecs({ bundles }) {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const isBelow900 = useMediaQuery({ query: '(max-width: 1279px)' });
  const isBelow960 = useMediaQuery({ query: '(max-width: 960px)' });
  const isBelow575 = useMediaQuery({ query: '(max-width: 575px)' });
  const isBelow992 = useMediaQuery({ query: '(max-width: 992px)' });
  const recsExist = useStore((store) => store.recsExist);

  const swiperConfig = {
    sliderPerView: 4,
    freeMode: true
  };

  if (isBelow900) {
    swiperConfig.sliderPerView = 3;
    swiperConfig.freeMode = true;

  }

  if (isBelow900) {
    swiperConfig.sliderPerView = 3;
    swiperConfig.freeMode = true;
  }
  if (isBelow960) {
    swiperConfig.sliderPerView = 2.5;
    swiperConfig.freeMode = true;
  }

  if (isBelow575) {
    swiperConfig.sliderPerView = 1.5;
    swiperConfig.freeMode = true;
  }

  const [ref, inView] = useInView({
    /* Optional options */
    triggerOnce: true,
    rootMargin: '0px 0px'
  });

  useEffect(() => {
    if (inView && recsExist === false) {
      bundleViewTracking();
    }
  }, [inView]);

  return (
    <div ref={ref} className={`inc_recs_block inc_pdp_page inc_count_${bundles.CategoryRecommendations.length}`} tabindex="0">
      <div className="inc_af_title_block">
        <h2 className="inc_af_title_text_block">Best selling similar products</h2>
      </div>
       {/* {getCountryCode() === "o9I0TrauK" &&
        <div className="inc_af_promo ">
          <div className="inc_af_promo_text">
            <span>Spend £200</span> and get Nail Art Stickers, Dotting Tool and 2-Piece Acrylic Oval Brush. Use Code <span>OPINAILART</span>
          </div>
        </div>
      } */}
      {(getCountryCode() === "o9I0uK" || getCountryCode() === "o9I0TrauK") &&
        <div className="inc_af_promo ">
          <div className="inc_af_promo_text">
          <span>Free travel size nail polish</span> when you spend  <span>£25</span> with code : <span>FREEMINI</span>
          </div>
        </div>
      } *
      {/* <div className="inc_af_promo inc_af_promo_2 ">
        <div className="inc_af_promo_text">
          <span>Get a free mystery bundle </span> when you spend <span>£45+ </span> with code: <span>MYSTERY</span>
        </div>
      </div> */}
      {/* {/* {getCountryCode() === "o9I0TrauK" && (<div className="inc_pdp_promo inc_pdp_promo_3 ">
        <div className="inc_af_promo inc_af_promo_2">
          <div className="inc_af_promo_text">
            <span>Free bundle worth £60</span> when you <span>spend £200</span> with code <span>OPILEAP</span>
          </div>
        </div>
      </div>)
      } */}




      <div className="inc_recs_bundles_block">
        {/* Swiper Carousel */}

        {/* Left Navigation */}

        <div className="inc_af_bundle_product_block">
          <div className="inc_af_bundle_nav_left" ref={(node) => setPrevEl(node)} />
          {isBelow992 == false ? <Swiper
            spaceBetween={0}

            modules={[Navigation]}
            slidesPerView={swiperConfig.sliderPerView}
            allowTouchMove={swiperConfig.freeMode}
            freeMode={swiperConfig.freeMode}

            navigation={{ prevEl, nextEl, disabledClass: 'inc_disabled' }}
          >
            {bundles.CategoryRecommendations &&
              bundles.CategoryRecommendations.map((product) => (
                <SwiperSlide key={product.ProductId} data-id={product.ProductId}>
                  <Product type="recs" productObject={product} main={false} uniqueType="001" />
                </SwiperSlide>
              ))}
          </Swiper> :

            <>
              {
                bundles.CategoryRecommendations &&
                bundles.CategoryRecommendations.map((product) => (

                  <Product key={product.ProductId} type="recs" productObject={product} main={false} uniqueType="001" />

                ))
              }
            </>
          }

          <div className="inc_af_bundle_nav_right" ref={(node) => setNextEl(node)} />
        </div>

        {/* Right Navigation */}
      </div>
    </div >
  );
}

export default DynamicRecs;
