import HeroSlider from "../components/ui/slider/heroSlider/HeroSlider";
import TeamSlider from "../components/ui/slider/teamSlider/TeamSlider";

import banner1 from "../assets/images/ATK-banner-03.jpg";
import banner2 from "../assets/images/ATK-banner-02.jpg";
import banner3 from "../assets/images/ATK-banner-01.jpg";

import team_1 from "../assets/images/team_1.png";

import artisan_2 from "../assets/images/artisan_3.png";
import artisan_1 from "../assets/images/artisan_4.png";

import ourCollections_1 from "../assets/images/ATK01.png";
import ourCollections_2 from "../assets/images/ourCollections_2.png";
import ourCollections_3 from "../assets/images/ourCollections_3.png";

import product_1 from "../assets/images/cat5_5.png";

import blog_img_1 from "../assets/images/2.png";
import blog_img_2 from "../assets/images/3.png";

const heroBanners = [
  {
    banner: banner1,
  },
  {
    banner: banner2,
  },
  {
    banner: banner3,
  },
];
const HeroBanner_array = heroBanners.map((e, index) => (
  <HeroSlider key={index} banner={e.banner} />
));

// -------------------------------------------------------------------------------------------------------------------------------------------------------------

const ourTeam = [
  {
    picture: team_1,
    fullName: "Ananya Mehra",
    designation: "Founder & Creative Director",
    description:
      "Ananya is the visionary behind Atulya Karigari. With a passion for traditional craftsmanship, she leads the creative direction, ensuring that every product is a unique blend of modern aesthetics and cultural heritage.",
  },
  {
    picture: team_1,
    fullName: "Ananya Mehra",
    designation: "Founder & Creative Director",
    description:
      "Ananya is the visionary behind Atulya Karigari. With a passion for traditional craftsmanship, she leads the creative direction, ensuring that every product is a unique blend of modern aesthetics and cultural heritage.",
  },
  {
    picture: team_1,
    fullName: "Ananya Mehra",
    designation: "Founder & Creative Director",
    description:
      "Ananya is the visionary behind Atulya Karigari. With a passion for traditional craftsmanship, she leads the creative direction, ensuring that every product is a unique blend of modern aesthetics and cultural heritage.",
  },
  {
    picture: team_1,
    fullName: "Ananya Mehra",
    designation: "Founder & Creative Director",
    description:
      "Ananya is the visionary behind Atulya Karigari. With a passion for traditional craftsmanship, she leads the creative direction, ensuring that every product is a unique blend of modern aesthetics and cultural heritage.",
  },
  {
    picture: team_1,
    fullName: "Ananya Mehra",
    designation: "Founder & Creative Director",
    description:
      "Ananya is the visionary behind Atulya Karigari. With a passion for traditional craftsmanship, she leads the creative direction, ensuring that every product is a unique blend of modern aesthetics and cultural heritage.",
  },
  {
    picture: team_1,
    fullName: "Ananya Mehra",
    designation: "Founder & Creative Director",
    description:
      "Ananya is the visionary behind Atulya Karigari. With a passion for traditional craftsmanship, she leads the creative direction, ensuring that every product is a unique blend of modern aesthetics and cultural heritage.",
  },
  {
    picture: team_1,
    fullName: "Ananya Mehra",
    designation: "Founder & Creative Director",
    description:
      "Ananya is the visionary behind Atulya Karigari. With a passion for traditional craftsmanship, she leads the creative direction, ensuring that every product is a unique blend of modern aesthetics and cultural heritage.",
  },
  {
    picture: team_1,
    fullName: "Ananya Mehra",
    designation: "Founder & Creative Director",
    description:
      "Ananya is the visionary behind Atulya Karigari. With a passion for traditional craftsmanship, she leads the creative direction, ensuring that every product is a unique blend of modern aesthetics and cultural heritage.",
  },
  {
    picture: team_1,
    fullName: "Ananya Mehra",
    designation: "Founder & Creative Director",
    description:
      "Ananya is the visionary behind Atulya Karigari. With a passion for traditional craftsmanship, she leads the creative direction, ensuring that every product is a unique blend of modern aesthetics and cultural heritage.",
  },
  {
    picture: team_1,
    fullName: "Ananya Mehra",
    designation: "Founder & Creative Director",
    description:
      "Ananya is the visionary behind Atulya Karigari. With a passion for traditional craftsmanship, she leads the creative direction, ensuring that every product is a unique blend of modern aesthetics and cultural heritage.",
  },
  {
    picture: team_1,
    fullName: "Ananya Mehra",
    designation: "Founder & Creative Director",
    description:
      "Ananya is the visionary behind Atulya Karigari. With a passion for traditional craftsmanship, she leads the creative direction, ensuring that every product is a unique blend of modern aesthetics and cultural heritage.",
  },
];

const ourTeam_array = ourTeam.map((e, index) => (
  <TeamSlider
    key={index}
    picture={e.picture}
    fullName={e.fullName}
    designation={e.designation}
    description={e.description}
  />
));

// -------------------------------------------------------------------------------------------------------------------------------------------------------------

const ourCollections = [
  {
    collection_name: "Handloom",
    collection_description:
      "Beautifully woven textiles that capture the essence of India.",
    picture: ourCollections_1,
    hoverBgColor: "rgba(96, 164, 135, 1)",
  },
  {
    collection_name: "Handicrafts",
    collection_description:
      "Uniquely handcrafted items, blending tradition and modernity.",
    picture: ourCollections_2,
    hoverBgColor: "rgba(109, 0, 29, 1)",
  },
  {
    collection_name: "Jewellery",
    collection_description:
      "Intricate designs crafted by artisans, celebrating the timeless elegance.",
    picture: ourCollections_3,
    hoverBgColor: "#d3aa9d",
  },
];

const ourSustainabilityPractices = [
  {
    title: "🌿 Ethically Sourced & Handmade",
    description:
      "Each product is crafted by hand with natural materials, ensuring ethical sourcing and promoting conscious consumerism.",
  },
  {
    title: "♻️ Sustainable Production",
    description:
      " We embrace slow fashion, minimizing our environmental impact through eco-friendly practices at every stage of production.",
  },
  {
    title: "💚 Fair Trade & Artisan Support",
    description:
      " We ensure fair wages for artisans, fostering sustainable livelihoods and a production cycle that honors both people and the planet.",
  },
];

// -------------------------------------------------------------------------------------------------------------------------------------------------------------

const blogs_array = [
  {
    blog_id: 1,
    blog_image: blog_img_2,
    blog_date: "2024-10-04",
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 2,
    blog_image: blog_img_1,
    blog_date: "2024-10-04",
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 3,
    blog_image: blog_img_2,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 4,
    blog_image: blog_img_1,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 5,
    blog_image: blog_img_2,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 5,
    blog_image: blog_img_1,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 5,
    blog_image: blog_img_2,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 5,
    blog_image: blog_img_1,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 5,
    blog_image: blog_img_2,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
];

// -------------------------------------------------------------------------------------------------------------------------------------------------------------

const top_product_list_from_category = {
  title: "Pure Raw Silk",
  subtitle: "Discover the timeless beauty of hand-printed sarees.",
  products: [
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
    {
      key: "1",
      title: "Silken Splendor",
      picture: product_1,
      price: 12000,
    },
  ],
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------------

const artisans = [
  {
    fullName: "Radhika Kumari",
    designation: "The Weaver of Tradition",
    picture: artisan_1,
    story:
      "Hailing from a small village in West Bengal, Radhika Kumari learned the intricate art of handloom weaving at an early age. Her delicate touch and attention to detail are reflected in every saree she weaves. Passionate about preserving traditional techniques, Radhika collaborates with Atulya Karigari to bring ancient weaving styles to a global audience. Each piece she creates not only embodies elegance but also supports her mission to keep her community's heritage alive.",
  },
  {
    fullName: "Ajay Patel",
    designation: "The Master Jeweler",
    picture: artisan_2,
    story:
      "Ajay Patel, a master jeweler from Rajasthan, specializes in traditional Kundan jewelry. With over 20 years of experience, his artistry lies in crafting intricate designs that blend timeless elegance with modern aesthetics. Ajay’s collaboration with Atulya Karigari has enabled him to showcase his exquisite craftsmanship to a wider audience, ensuring the legacy of Kundan jewelry continues to thrive.",
  },
];

// -------------------------------------------------------------------------------------------------------------------------------------------------------------

export {
  HeroBanner_array,
  ourTeam_array,
  ourCollections,
  blogs_array,
  top_product_list_from_category,
  artisans,
  ourSustainabilityPractices,
};
