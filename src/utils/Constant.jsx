import HeroSlider from "../components/ui/slider/heroSlider/HeroSlider";
import TeamSlider from "../components/ui/slider/teamSlider/TeamSlider";
import banner1 from "../assets/images/banner_1.png";
import team_1 from "../assets/images/team_1.png";

import ourCollections_1 from "../assets/images/ourCollections_1.png";
import ourCollections_2 from "../assets/images/ourCollections_2.png";
import ourCollections_3 from "../assets/images/ourCollections_3.png";

import product_1 from "../assets/images/product_1.png";

import blog_img from "../assets/images/blogImg.png";

const heroBanners = [
  {
    banner: banner1,
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
    hoverBgColor: "rgba(211, 170, 157, 1)",
  },
];

// -------------------------------------------------------------------------------------------------------------------------------------------------------------

const blogs_array = [
  {
    blog_id: 1,
    blog_image: blog_img,
    blog_date: "2024-10-04",
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 2,
    blog_image: blog_img,
    blog_date: "2024-10-04",
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 3,
    blog_image: blog_img,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 4,
    blog_image: blog_img,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 5,
    blog_image: blog_img,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 5,
    blog_image: blog_img,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 5,
    blog_image: blog_img,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 5,
    blog_image: blog_img,
    blog_title: "Choosing Ethical Fashion: Why It Matters",
    blog_date: "2024-10-04",
    blog_description:
      "Educate readers on the importance of ethical fashion and how Atulya Karigari supports fair wages, humane working conditions, and responsible sourcing...",
  },
  {
    blog_id: 5,
    blog_image: blog_img,
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
  ],
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------------

export {
  HeroBanner_array,
  ourTeam_array,
  ourCollections,
  blogs_array,
  top_product_list_from_category,
};
