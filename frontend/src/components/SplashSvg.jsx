
import logo from "../assets/logo.jpg";
export default function SplashSvg() {
  return (
    <div className="fachada">
      {" "}

      <div className="splash-svg-container fachada">

        <svg>
          <text x="50%" y="50%" dy=".35em" textAnchor="middle">
            PLAZA DENTAL
          </text>
        </svg>
        <img className="logo" src={logo} alt="logo" />
      </div>
    </div>
  );
}
