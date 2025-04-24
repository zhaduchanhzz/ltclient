import BasicIconButton from "@/components/base/MaterialUI-Basic/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useEffect, useState } from "react";

type ScrollToTopButtonProps = {};

const ScrollToTopButton = (_: ScrollToTopButtonProps) => {
  const [showButton, setShowButton] = useState<boolean>(false);

  // Check if the user has scrolled down
  const checkScrollPosition = () => {
    if (window.scrollY > 200) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollPosition);

    return () => window.removeEventListener("scroll", checkScrollPosition);
  }, []);
  return (
    <>
      {showButton && (
        <BasicIconButton
          style={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
            zIndex: 1000,
            border: "1px solid #ccc",
          }}
          onClick={scrollToTop}
        >
          <ArrowUpwardIcon
            sx={{ borderRadius: "50%", fontSize: 40, color: "#ccc" }}
          />
        </BasicIconButton>
      )}
    </>
  );
};

export { ScrollToTopButton };
