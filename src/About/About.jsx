import React from 'react'
import PageHeader from '../components/PageHeader';

import aboutImage1 from '../assets/images/about/01.jpg';
import aboutImage2 from '../assets/images/about/02.jpg';

import aboutIcon1 from '../assets/images/about/icon/01.jpg';
import aboutIcon2 from '../assets/images/about/icon/02.jpg';
import aboutIcon3 from '../assets/images/about/icon/03.jpg';

const subTitle = "About Our Brand";
const title = "Curated Products For A Better Shopping Experience";
const desc = "ShopCart is your online destination for electronics, jewellery, and everyday fashion. We bring a curated range of products together with clear details, simple navigation, and a straightforward experience from product discovery to checkout.";

const statValue = "20+";
const statLabel = "Curated Products";

const aboutList = [
    {
        imgUrl: aboutIcon1,
        imgAlt: 'Customer-first shopping',
        title: 'Customer-First Shopping',
        desc: 'Browse by category, compare product details, and move from cart to checkout through a clear, easy-to-use experience.',
    },
    {
        imgUrl: aboutIcon2,
        imgAlt: 'Curated quality',
        title: 'Curated Quality',
        desc: 'Explore a focused selection of electronics, jewellery, and fashion essentials presented with transparent pricing and useful product information.',
    },
    {
        imgUrl: aboutIcon3,
        imgAlt: 'Responsive customer support',
        title: 'Responsive Support',
        desc: 'Have a question about a product or your order? Reach out through our Contact page and our team will be happy to help.',
    },
]

const About = () => {
  return (
    <div>
          <PageHeader title={'About Our Brand'} curPage={'About'} />
        <div className="about-section style-3 padding-tb section-bg">
                <div className="container">
                    <div className="row justify-content-center row-cols-xl-2 row-cols-1 align-items-center">
                        <div className="col">
                            <div className="about-left">
                                <div className="about-thumb">
                                    <img src={aboutImage1} alt="Customer enjoying online shopping with ShopCart" />
                                </div>
                                <div className="abs-thumb">
                                    <img src={aboutImage2} alt="Customer browsing products on ShopCart" />
                                </div>
                                <div className="about-left-content">
                                    <h3>{statValue}</h3>
                                    <p>{statLabel}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="about-right">
                                <div className="section-header">
                                    <span className="subtitle">{subTitle}</span>
                                    <h2 className="title">{title}</h2>
                                    <p>{desc}</p>
                                </div>
                                <div className="section-wrapper">
                                    <ul className="lab-ul">
                                        {aboutList.map((val, i) => (
                                            <li key={i}>
                                                <div className="sr-left">
                                                    <img src={`${val.imgUrl}`} alt={`${val.imgAlt}`} />
                                                </div>
                                                <div className="sr-right">
                                                    <h5>{val.title}</h5>
                                                    <p>{val.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default About;
