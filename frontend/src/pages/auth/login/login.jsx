import "./login.css";
import loginIcon from "../../../assets/images/loginIcon.svg";

export default function login() {
  return (
    <div className="login_container">
      <section>
        <article>
          <h1>Atulyakarigari</h1>
          <div className="form_container">
            <figure>
              <img src={loginIcon} alt="Login Icon" />
            </figure>
            <h2>Log in</h2>
            <h3>Use your email or phone number to log in </h3>

            <form>
              <div>
                <label htmlFor="">Email or Phone Number</label>
                <input
                  type="text"
                  name="email/phone"
                  id="email/phone"
                  placeholder="Enter Your Email / Phone No."
                />
              </div>
              <div>
                <button type="button">Continue</button>
              </div>
            </form>
          </div>
          <p>
            Don&apos;t have an account yet? <span>Sign up</span>
          </p>
        </article>
      </section>
      <section></section>
    </div>
  );
}
