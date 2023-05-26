import Image from "next/image";
import logo from "../../public/site-logo.svg";

const Header = () => {
  return (
    <>
      <div className="header">
        <div className="container">
          <div className="header-wrapper">
            <div className="logo-wrapper">
              <Image src={logo} alt="Sitelogo" />
            </div>
            <div className="header-text">
              <p>SME HealthCheck - Get Started</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
