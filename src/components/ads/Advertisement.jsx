import React from "react";
import "./Advertisement.css";

const Advertisement = () => {
  const ads = [
    { title: "Promoted Content", description: "Ad will be displayed here." },
    { title: "Advertisement", description: "Google AdSense Placeholder" },
    { title: "Sponsored", description: "Relevant ads will appear soon." }
  ];

  return (
    <aside className="ad-container">
      <h3 className="ad-title">Sponsored Ads</h3>

      {ads.map((ad, index) => (
        <div key={index} className="ad-box">
          <p>{ad.title}</p>
          <small>{ad.description}</small>
        </div>
      ))}
    </aside>
  );
};

export default Advertisement;
