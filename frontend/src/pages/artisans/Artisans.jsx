import "./Artisans.css";
import wingPattern from "../../assets/images/wingPattern_white.svg";
import { EmblaSlider } from "../../components/ui/slider/EmblaSlider";
import ArtisansSlide from "../../components/ui/slider/artisansSlider/ArtisansSlide";
import { artisans } from "../../utils/Constant";

export default function Artisans() {
  const artisans_slider_array = artisans.map((artisan, index) => {
    return (
      <ArtisansSlide
        key={index}
        fullName={artisan.fullName}
        designation={artisan.designation}
        picture={artisan.picture}
        story={artisan.story}
      />
    );
  });

  return (
    <div className="artisans_container">
      <figure className="artisans_heroBanner"></figure>
      <section>
        <h2>Meet Our Artisans: The Heart of Atulya Karigari</h2>
        <figure>
          <img src={wingPattern} alt="Design Pattern" />
        </figure>
        <p>
          At Atulya Karigari, our artisans are the soul behind every
          masterpiece. Each piece they create tells a story of heritage,
          craftsmanship, and dedication, passed down through generations. From
          skilled weavers to master artisans, they bring traditional Indian art
          forms to life through their hands. We are proud to collaborate with
          these talented individuals who infuse their unique artistry and
          passion into every product, preserving India’s cultural richness while
          providing them with sustainable livelihoods.
        </p>
      </section>
      <section>
        <EmblaSlider
          plugins={["autoplay"]}
          slides_in_view={{ xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          options={{ delay: 8000, dragFree: true }}
          slides={artisans_slider_array}
          no_of_slides={5}
          navigationArrow={true}
        />
      </section>
      <section>
        <h2>Artisan Spotlight: A Conversation with Our Craftsmen</h2>

        <div>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/COxJUmf1udI?si=kwmRr350OVXDJt8t"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </section>
    </div>
  );
}
