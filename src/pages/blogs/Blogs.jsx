import BlogCard from "../../components/ui/cards/blogCard/BlogCard";
import DatePicker from "../../components/ui/datePicker/DatePicker";
import { blogs_array } from "../../utils/Constant";
import { useState } from "react";

import "./Blogs.css";

export default function Blogs() {
  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const topBlogs = [
    {
      title: "The Future of Handcrafted Fashion in a Digital World",
      description:
        "Discuss the challenges and opportunities that digital technology presents for handmade crafts, and how Atulya Karigari adapts to stay relevant.",
    },
    {
      title: "The Future of Handcrafted Fashion in a Digital World",
      description:
        "Discuss the challenges and opportunities that digital technology presents for handmade crafts, and how Atulya Karigari adapts to stay relevant.",
    },
    {
      title: "The Future of Handcrafted Fashion in a Digital World",
      description:
        "Discuss the challenges and opportunities that digital technology presents for handmade crafts, and how Atulya Karigari adapts to stay relevant.",
    },
    {
      title: "The Future of Handcrafted Fashion in a Digital World",
      description:
        "Discuss the challenges and opportunities that digital technology presents for handmade crafts, and how Atulya Karigari adapts to stay relevant.",
    },
    {
      title: "The Future of Handcrafted Fashion in a Digital World",
      description:
        "Discuss the challenges and opportunities that digital technology presents for handmade crafts, and how Atulya Karigari adapts to stay relevant.",
    },
  ];

  return (
    <div className="blogPage_container">
      <section>
        <div className="inputContainer">
          <input
            type="search"
            name="search"
            id="seach"
            placeholder="Search blog here"
          />
        </div>
        <div className="blogFilter_container">
          <div>
            {/* <Dropdown
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.value)}
              options={cities}
              optionLabel="name"
              placeholder="Categories"
            /> */}
          </div>
          <div>
            <DatePicker />
          </div>
        </div>
        <div className="topBlogs_container">
          <h1>Top Posts</h1>
          <article>
            {topBlogs.map((topBlog, index) => {
              return (
                <div key={index}>
                  <h2>{topBlog.title}</h2>
                  <p>{topBlog.description}</p>
                </div>
              );
            })}
          </article>
        </div>
      </section>
      <section>
        <div>
          {blogs_array.map((blog, index) => {
            return (
              <BlogCard
                key={index}
                blog_title={blog.blog_title}
                blog_description={blog.blog_description}
                blog_image={blog.blog_image}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
