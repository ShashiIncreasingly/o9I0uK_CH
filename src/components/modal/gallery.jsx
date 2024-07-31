import uniq from 'lodash/uniq';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useSwipeable } from 'react-swipeable';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper-bundle.css';
import 'swiper/swiper.min.css';
import Tracking from '../../api/tracking';
import { handleFallbackImage } from '../../lib/helpers';
import './gallery.scss';

function GalleryListItem({
  image,
  index,
  setMainImage,
  handleClick,
  setGalleryCount,
  imagesGallery,
  mainImage,
}) {
  const ref = useRef(null);
  const updateImage = (currentImage) => {
    setMainImage(currentImage);
    handleClick(ref);
    const findImage = imagesGallery.indexOf(currentImage);
    setGalleryCount(findImage + 1);
  };

  useEffect(() => {
    if (mainImage.split('?')[0] === image.split('?')[0]) {
      handleClick(ref);
    }
  }, [mainImage]);

  return (
    <div key={index} role="button" onClick={() => updateImage(image)} onKeyDown={() => updateImage(image)} tabIndex={0}>
      <img onError={(e) => handleFallbackImage(e)} ref={ref} className={`inc_product_image_gallery_list_item ${image.split('?')[0] === mainImage.split('?')[0] ? 'active' : ''}`} src={image} alt="Gallery Images" />
    </div>
  );
}

function Gallery({
  images, activeMainImage, ProductId, ProductUrl, type
}) {
  const [mainImage, setMainImage] = useState(activeMainImage);
  const [imagesGallery, setImagesGallery] = useState(images);
  const [galleryCount, setGalleryCount] = useState(1);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });
  const imageCount = imagesGallery.length;
  const showPrev = () => {
    let findImage = imagesGallery.indexOf(mainImage);
    if (findImage === 0) findImage = imagesGallery.length;
    if (findImage === -1) findImage = imagesGallery.length;
    setMainImage(imagesGallery[findImage - 1]);
    setGalleryCount(findImage);
  };

  const swiperConfig = {
    sliderPerView: 1,
    freeMode: false,
  };

  if (isMobileBelow) {
    // swiperConfig.sliderPerView = 3;
    // swiperConfig.freeMode = true;
  }

  const showNext = () => {
    let findImage = imagesGallery.indexOf(mainImage);
    if (findImage === imagesGallery.length - 1) findImage = -1;
    setMainImage(imagesGallery[findImage + 1]);
    setGalleryCount(findImage + 2);
  };

  const sendClickTrackDelayed = (ProductId, ProductUrl, typeModule, e) => {
    e.preventDefault();
    Tracking.sendBundleClickTracking(ProductId, null, typeModule);

    setTimeout(() => {
      window.location.href = `${ProductUrl}`;
    }, 1000);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => showNext(),
    onSwipedRight: () => showPrev(),
  });

  const handleClick = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  useEffect(() => {
    setMainImage(activeMainImage);
    const findImage = imagesGallery.find((image) => image === activeMainImage);
    if (!findImage) {
      const newGallery = uniq([activeMainImage, ...imagesGallery]);
      setImagesGallery([...newGallery]);
    } else {
      const updatedimagesGallery = imagesGallery.filter((image) => image !== activeMainImage);
      const newGallery = uniq([activeMainImage, ...updatedimagesGallery]);

      setImagesGallery([...newGallery]);
    }
  }, [activeMainImage]);

  return (
    <div className="inc_product_image_gallery">
      {imagesGallery.length > 1 && (
        <div className="inc_product_image_gallery_block">

          {!isMobileBelow && galleryCount !== 1 && imageCount > 9 && <div role="button" aria-label="Previous" tabIndex={0} className="inc_product_active_gallery_left vertical_left" onClick={() => showPrev()} onKeyDown={() => showPrev()} />}
          {!isMobileBelow && imagesGallery.length > 1 && imagesGallery.map((image, index) => (
            <GalleryListItem
              key={index}
              index={index}
              image={image}
              setMainImage={setMainImage}
              handleClick={handleClick}
              setGalleryCount={setGalleryCount}
              imagesGallery={imagesGallery}
              mainImage={mainImage}
            />
          ))}
          {!isMobileBelow && galleryCount !== imageCount && imageCount > 9 && <div role="button" tabIndex={0} aria-label="Next" className="inc_product_active_gallery_right vertical_right" onClick={() => showNext()} onKeyDown={() => showNext()} />}
        </div>
      )}
      {!isMobileBelow && (
        <div className="inc_product_active_gallery_block">
          {imagesGallery.length > 1 && <div className="inc_product_active_gallery_left" onClick={() => showPrev()} onKeyDown={() => showPrev()} role="button" tabIndex={0} aria-label="Next" />}
          <a href={ProductUrl.replace('https://www.opi.com', window.location.origin)} onClick={(e) => sendClickTrackDelayed(ProductId, ProductUrl.replace('https://www.opi.com', window.location.origin), type, e)}>
            <img {...handlers} style={{ touchAction: 'pan-y', maxWidth: '600px' }} onError={(e) => handleFallbackImage(e)} src={mainImage} alt="" className="inc_product_active_image_gallery" />
          </a>
          {imagesGallery.length > 1 && <div className="inc_product_active_gallery_right" role="button" onClick={() => showNext()} onKeyDown={() => showNext()} aria-label="Previous" tabIndex={0} />}
          <div className="inc_product_image_gallery_count">{`${galleryCount} / ${imageCount}`}</div>
          <div className="inc_product_gallery_dots_parent">
            {imagesGallery.length > 1 && imagesGallery.map((image, index) => (
              <div key={index} className={`inc_product_gallery_dots ${image == mainImage ? 'inc_active' : ''}`} />
            ))}
          </div>
        </div>
      )}

      {isMobileBelow && (
        <div >
          <Swiper
            spaceBetween={0}
            modules={[Navigation, Pagination]}
            slidesPerView={1.2}
            pagination={true}
          >
            {imagesGallery.length >= 1 && imagesGallery.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image} alt="OPI Product" onClick={(e) => sendClickTrackDelayed(ProductId, ProductUrl.replace('https://www.opi.com', window.location.origin), type, e)} />
              </SwiperSlide>

            ))}

          </Swiper>
        </div>
      )}

    </div>
  );
}

Gallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
  activeMainImage: PropTypes.string.isRequired,
  ProductId: PropTypes.string.isRequired,
};

Gallery.defaultProps = {
  images: [],
};
GalleryListItem.propTypes = {
  image: PropTypes.string.isRequired,
  setMainImage: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  setGalleryCount: PropTypes.func.isRequired,
  imagesGallery: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string])).isRequired,
  mainImage: PropTypes.string.isRequired,
};

export default React.memo(Gallery);
