import "./About.css";
import aboutImg_1 from "../../assets/images/aboutImg_1.png";
import aboutImg_2 from "../../assets/images/aboutImg_2.png";
import { EmblaSlider } from "../../components/ui/slider/EmblaSlider";
import { ourTeam_array } from "../../utils/Constant";
import CategoryView from "../../components/layout/categoryView/CategoryView";

export default function About() {
  return (
    <div className="about_container">
      <div>
        <figure className="about_heroBanner">
          <div>
            <h1>About Us</h1>
          </div>
        </figure>
      </div>

      <article className="about_sec-1">
        <figure>
          <img src={aboutImg_1} alt="" />
        </figure>

        <div>
          <h2 style={{ fontWeight: 400 }}>Who We Are</h2>
          <figure>
            <img src={aboutImg_1} alt="" />
          </figure>
          <p>
            Atulyakarigari India is a brand of handloom and handicrafts
            established as a CSR initiative by Annapurna Finance Pvt Ltd. Our
            primary goal is to support female artisans whose talents have often
            been overlooked. We aim to empower them by providing a platform that
            connects their exceptional skills with the right market, eliminating
            unnecessary intermediaries.
          </p>
        </div>
        <div>
          <h2>Our Brand Story</h2>
          <p>
            Our brand combines contemporary trends with the rich traditions of
            India. We cherish and preserve our country’s mystique and heritage.
            In today’s fast-paced world, maintaining a dedicated space for
            handmade crafts and handloom is a significant challenge.
            Atulyakarigari recognizes the pressing need to revive ancient art
            forms that are fading away, while also supporting the livelihoods of
            female artisans who work tirelessly to sustain themselves.
          </p>
        </div>
      </article>
      <article className="about_sec-2">
        <div>
          <h2>Our Journey</h2>
          <p>
            Atulyakarigari invites you to join us on a remarkable journey, a
            celebration of SILK in its purest form. Our collection includes
            handcrafted wedding outfits made from the finest Khandua SILK,
            adorned with intricate pattachitra paintings, as well as exquisite
            Banarsi SILK Lehengas, complemented by pure organza silk, and
            crowned with the elegance of Zardozi Lehengas.
          </p>
        </div>

        {/* <figure>
          <img src={aboutImg_2} alt="" />
        </figure> */}
        <article>
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/wVHC8FIktdc?si=6wDt8ff2JUx7ZRmR&autoplay=1&mute=1&loop=1&playlist=wVHC8FIktdc"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </article>
        <div>
          <h2>Why Choose Us?</h2>
          <p>
            By choosing Atulyakarigari, you become a part of our mission to
            bring smiles to the faces of immensely talented weavers and
            artisans. Together, we can make a difference in preserving India’s
            artistic heritage and empowering its female artisans.
          </p>
        </div>
      </article>
      <article className="about_sec-3">
        <h2>Meet Our Team</h2>
        <p>
          Atulya Karigari unites artisans and designers across India to blend
          traditional artistry with contemporary appeal. Committed to preserving
          India’s craft heritage, the team collaborates closely with artisans to
          create designs that highlight their skills and meet modern tastes.
        </p>
        <div>
          <EmblaSlider
            slides={ourTeam_array}
            options={{
              delay: 3000,
              draggable: false,
              preventScrollOnTouch: true,
              // loop: true,
            }}
            navigationDots={false}
            slides_in_view={{ xl: 7, lg: 5, md: 3, sm: 3, xs: 1 }}
            plugins={["autoplay", "classname"]}
            centerSlideStyle={{
              style: "centerStyle",
            }}
          />
        </div>
      </article>
      <article className="about_sec-4">
        <h2>Our Collections</h2>
        {/* <div className="collection_container">
          {ourCollections.map((collection, index) => {
            return (
              <div key={index}>
                <img
                  src={collection.picture}
                  alt={collection.collection_name}
                />
                <div
                  className="collection_descriptionCard"
                  style={{ backgroundColor: collection.hoverBgColor }}
                >
                  <h3>{collection.collection_name}</h3>
                  <div></div>
                  <p>{collection.collection_description}</p>
                  <div>
                    <img src={rightArrow} alt="Right Arrow" />
                  </div>
                </div>
              </div>
            );
          })}
        </div> */}
        <CategoryView />
      </article>
      <article className="about-sec-5">
        <div>#Our Sustainability Practices</div>
        <div>
          <div>
            <h2>🌿 Ethically Sourced & Handmade</h2>
            <p>
              Each product is crafted by hand with natural materials, ensuring
              ethical sourcing and promoting conscious consumerism.
            </p>
          </div>
          <div>
            <h2>♻️ Sustainable Production</h2>
            <p>
              We embrace slow fashion, minimizing our environmental impact
              through eco-friendly practices at every stage of production.
            </p>
          </div>
          <div>
            <h2>💚 Fair Trade & Artisan Support</h2>
            <p>
              We ensure fair wages for artisans, fostering sustainable
              livelihoods and a production cycle that honors both people and the
              planet.
            </p>
          </div>
        </div>
      </article>
      <article className="about_sec-6">
        <div>
          <h2>Each product at Atulya Karigari tells a story —</h2>
          <p>
            a story of craftsmanship, dedication, and creativity. Discover the
            beauty of India’s traditional artistry, reimagined for today’s
            world.
          </p>
          <button>Explore Now</button>
        </div>
      </article>
    </div>
  );
}
