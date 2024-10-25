import "./SignUp.css";

import loginIcon from "../../../assets/images/loginIcon.svg";

export default function SignUp() {
  return (
    <div>
      <div className="signUp_container">
        <section>
          <article>
            <h1>Atulyakarigari</h1>
            <div className="form_container">
              <figure>
                <img src={loginIcon} alt="Login Icon" />
              </figure>
              <h2>Sign Up</h2>
              <h3>Use your email or phone number to log in </h3>

              <form>
                <div>
                  <label htmlFor="">Name*</label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    placeholder="Enter Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="">Email*</label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Enter Your Email "
                  />
                </div>
                <div>
                  <label htmlFor="">Phone Number*</label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Enter Your Email "
                  />
                </div>
                <div>
                  <button type="button">Next</button>
                </div>
              </form>
            </div>
            <p>
              Already have account?<span>Log in</span>
            </p>
          </article>
        </section>
        <section></section>
      </div>
    </div>
  );
}
