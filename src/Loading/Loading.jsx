import React from 'react';
import './Loading.css';
import Logo from '../assets/Logo.jpg'

const Loading = () => {
  return (
    <div className="kaganat-exclusive-fullscreen-loader">
      <div className="kaganat-loader-center-content">
        
        {/* Кыркылган жана ортодо айлана турган логотип */}
        <div className="kaganat-loader-image-circle">
          <img src={Logo} alt="Kaganat Premium" className="kaganat-loader-img" />
        </div>
        
        {/* Хедэрдин стилиндеги эки катарлуу чоң жазуу */}
        <div className="kaganat-loader-brand-title">
          <span className="kaganat-title-gold">KAGANAT</span>
          <span className="kaganat-title-white">PREMIUM</span>
        </div>

      </div>
    </div>
  );
};

export default Loading;