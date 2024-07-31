import React from 'react';
import useStore from '../zustand/store';
import RecommendationPage from './RecommendationPage';

function SidebarRecommendation() {
  const recommendation = useStore((store) => store.recommendation);
  const recsExist = useStore((store) => store.recsExist);
  return (
    <p>Sidebar Recommendation</p>
  );
}

export default SidebarRecommendation;
