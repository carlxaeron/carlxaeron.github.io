import { navigateToLogin } from "../admin/useAppMode";
import { isStandalonePwa } from "../utils/isStandalonePwa";

function NavLoginLink({ className = "", onNavigate }) {
  if (!isStandalonePwa()) return null;

  const handleClick = (event) => {
    event.preventDefault();
    navigateToLogin();
    onNavigate?.();
  };

  return (
    <a
      href="#login"
      className={`v3-nav-login${className ? ` ${className}` : ""}`}
      onClick={handleClick}
    >
      Login
    </a>
  );
}

export default NavLoginLink;
