import React from "react";
import "./Ads.css";


const Ads = () => {
  return (
    <div className="ads-section">
      <h3>Sponsored</h3>
      <div className="ad-placeholder">
        <p>Ad Here</p>
        <small>Ads will be displayed once approved.</small>
      </div>

      <div className="ad-placeholder">
        <p>Advertisement</p>
        <small>Google AdSense will be placed here.</small>
      </div>

      <div className="ad-placeholder">
        <p>Advertisement</p>
        <small>Google AdSense will be placed here.</small>
      </div>
    </div>
  );
};

export default Ads;
