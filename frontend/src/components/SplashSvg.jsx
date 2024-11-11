
import logo from "../assets/logo.jpg";
export default function SplashSvg() {
  return (
    <div className="fachada">
      {" "}

      <div className="splash-svg-container fachada">
        <img className="logo" src={logo} alt="logo" />
        <svg>
          <text x="50%" y="15%" dy=".35em" textAnchor="middle">
            PLAZA DENTAL
          </text>
        </svg>

      </div>
    </div>
  );
}
