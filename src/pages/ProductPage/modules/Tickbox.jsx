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
import '../styles/Tickbox.scss';



function Tickbox({ tickBoxBundles }) {

  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1290px)' });
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });

  const [bundleIds, setBundleIds] = useState({});

  const handleBundleIds = () => {
    const BundlesMapToIds = {};
    tickBoxBundles.Bundles.map((bundle, index) => {
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
    <div className="inc_tickbox_block incActive" ref={ref}>
      {/* Title Block */}
      <div className="inc_tickbox_title_block">
        <div className="inc_tickbox_title_text_block">
          <div className="inc_tickbox_title_text">Customers also buy</div>
        </div>
      </div>

      {/* Bundle Section */}
      <div className="inc_tickbox_bundle_block">
        {/* Load First tickbox Product */}
        <div>
            {tickBoxBundles.ProductsDetail
            && tickBoxBundles.ProductsDetail.slice(1, 2).map((product, idx) => (
                <Product type="tickbox" productObject={product} key={product.ProductId} main={false} idx={idx} />
            ))}
        </div>
      </div>
    </div>
  );
}

Tickbox.propTypes = {
  tickBoxBundles: PropTypes.object.isRequired,
};

export default Tickbox;
