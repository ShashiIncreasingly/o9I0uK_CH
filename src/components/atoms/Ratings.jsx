import React from 'react';
import PropTypes from 'prop-types';
import { Rating } from 'react-simple-star-rating';
import './ratings.scss';
import { enviroment } from '@/lib/helpers';

function Ratings({ rating, ratingCount, type }) {
  //

  if (enviroment() === "development") {
    rating = 0
    ratingCount = 0
  }
  if (rating === 0 || rating == null) {
    return (
      <div className={`inc_product_desc_ratings_block ${type == 'modal' ? 'inc_modal' : type}`}>
        <span style={{ height: '25px' }}> </span>
      </div>
    );
  }
  return (
    <div className={`inc_product_desc_ratings_block ${type == 'modal' ? 'inc_modal' : type}`}>
      <Rating
        initialValue={rating}
        allowHover={false}
        readonly
        allowFraction
        fillColor="#363636"
        size={15}
      />
      <div className="inc_product_ratings_count">
        <span className='inc_product_ratings_count_number'>{ratingCount}</span>
       
        <span className='inc_product_ratings_count_text'> {ratingCount == 1 ? "Review" : "Reviews"}</span>
       
        
      </div>
    </div>
  );
}
Ratings.propTypes = {
  rating: PropTypes.number,
  ratingCount: PropTypes.number,
  type: PropTypes.string,
};
export default Ratings;
