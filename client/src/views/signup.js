import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import countryList from "react-select-country-list";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import { Briefcase, UserRound } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import "../styles/signup.css";
import "../styles/login.css";

export default function SignupForm() {
  const [accountType, setAccountType] = useState("personal");
  const [country, setCountry] = useState(null);
  const options = countryList().getData();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, touchedFields }
  } = useForm({ mode: "onChange" });

  const password = watch("password");

  const isPasswordStrong = (val) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val);

  const onSubmit = async (formData) => {
    const dataToSend = {
      accountType,
      country: country?.value || "",
      ...formData
    };

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Account created successfully");
        reset();
        setCountry(null);
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const renderField = (label, name, type = "text") => (
    <div className="signup-form-group">
      <label>{label}</label>
      <input
        name={name}
        type={type}
        placeholder={label}
        className={
          touchedFields[name]
            ? errors[name]
              ? "input-error"
              : "input-valid"
            : ""
        }
        {...register(name, {
          required: `${label} is required`
        })}
      />
      {errors[name] && <p className="input-hint">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="signup-page">
      <section className="signup-hero">
        <div className="brand-pill">Bidme</div>

        <h1>
          Join the
          <br />
          marketplace.
        </h1>

        <p>
          Create your account to buy, bid, sell products, track auctions, and
          manage your marketplace activity securely.
        </p>

        <div className="signup-hero-stats">
          <div>
            <strong>Bid</strong>
            <span>Compete in live auctions</span>
          </div>
          <div>
            <strong>Sell</strong>
            <span>List products easily</span>
          </div>
          <div>
            <strong>Win</strong>
            <span>Track results instantly</span>
          </div>
        </div>
      </section>

      <section className="signup-panel">
        <div className="signup-card">
          <div className="signup-card-header">
            <h2>
              {accountType === "personal"
                ? "Create personal account"
                : "Create business account"}
            </h2>
            <p>Choose an account type and complete your profile.</p>
          </div>

          <div className="signup-toggle-modern">
            <button
              type="button"
              className={accountType === "personal" ? "active" : ""}
              onClick={() => setAccountType("personal")}
            >
              <UserRound size={18} />
              Personal
            </button>

            <button
              type="button"
              className={accountType === "business" ? "active" : ""}
              onClick={() => setAccountType("business")}
            >
              <Briefcase size={18} />
              Business
            </button>
          </div>

          <form className="signup-form-modern" onSubmit={handleSubmit(onSubmit)}>
            {accountType === "personal" ? (
              <>
                {renderField("Full Name", "fullName")}
                {renderField("Email Address", "email", "email")}
              </>
            ) : (
              <>
                {renderField("Business Name", "businessName")}
                {renderField("Business Email", "email", "email")}
              </>
            )}

            {renderField("Username", "username")}

            <div className="signup-form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className={
                  touchedFields.password
                    ? errors.password
                      ? "input-error"
                      : "input-valid"
                    : ""
                }
                {...register("password", {
                  required: "Password is required",
                  validate: (val) =>
                    isPasswordStrong(val) ||
                    "Must be 8+ characters, incl. letter, number & symbol"
                })}
              />
              {errors.password && (
                <p className="input-hint">{errors.password.message}</p>
              )}
            </div>

            <div className="signup-form-group">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className={
                  touchedFields.confirmPassword
                    ? errors.confirmPassword
                      ? "input-error"
                      : "input-valid"
                    : ""
                }
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (val) =>
                    (val === password && isPasswordStrong(password)) ||
                    "Passwords must match and meet strength rules"
                })}
              />
              {errors.confirmPassword && (
                <p className="input-hint">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="signup-form-group">
              <label>Country</label>
              <Select
                options={options}
                value={country}
                onChange={(selectedOption) => setCountry(selectedOption)}
                placeholder="Select country"
                className="country-select"
                classNamePrefix="country"
              />
            </div>

            <button className="signup-submit-btn" type="submit">
              {accountType === "personal"
                ? "Create Personal Account"
                : "Create Business Account"}
            </button>
          </form>

          <div className="signup-footer-row">
            <span>Already have an account?</span>
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </section>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}