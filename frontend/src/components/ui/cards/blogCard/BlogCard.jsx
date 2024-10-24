import "./BlogCard.css";
import PropTypes from "prop-types";

export default function BlogCard({ blog_image, blog_title, blog_description }) {
  return (
    <div className="blogCard_container">
      <div>
        <img src={blog_image} alt="" />
      </div>
      <article>
        <div>{blog_title}</div>
        <div>{blog_description}</div>
        <div>
          <svg
            width="17"
            height="15"
            viewBox="0 0 17 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.1759 13.8049L17 7.04621L10.1759 0.287496C10.1142 0.207754 10.0359 0.141989 9.94626 0.0946542C9.85659 0.0473197 9.75764 0.0195206 9.65612 0.0131386C9.5546 0.0067565 9.45287 0.0219409 9.35782 0.0576633C9.26277 0.0933857 9.17662 0.148812 9.10521 0.220191C9.03379 0.291569 8.97877 0.377233 8.94388 0.471384C8.90898 0.565534 8.89503 0.665972 8.90295 0.765898C8.91088 0.865824 8.94051 0.962906 8.98982 1.05057C9.03914 1.13824 9.107 1.21444 9.18881 1.27402L14.2945 6.34655L0.71011 6.34655C0.521776 6.34655 0.341158 6.42026 0.207987 6.55148C0.0748158 6.68269 0 6.86065 0 7.04621C0 7.23177 0.0748158 7.40973 0.207987 7.54095C0.341158 7.67216 0.521776 7.74587 0.71011 7.74587L14.2945 7.74587L9.18881 12.8184C9.05603 12.9502 8.98181 13.1285 8.98248 13.3141C8.98314 13.4998 9.05864 13.6776 9.19236 13.8084C9.32607 13.9392 9.50706 14.0124 9.69549 14.0117C9.88393 14.0111 10.0644 13.9367 10.1972 13.8049H10.1759Z"
              fill="#B0B0B0"
            />
          </svg>
        </div>
      </article>
    </div>
  );
}

BlogCard.propTypes = {
  blog_image: PropTypes.string,
  blog_title: PropTypes.string,
  blog_description: PropTypes.string,
};
