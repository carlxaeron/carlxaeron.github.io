import { useEffect } from "react";

const BODY_CLASS = "v3-modal-open";

function useModalBodyLock(isOpen) {
  useEffect(() => {
    if (!isOpen) return undefined;

    document.body.classList.add(BODY_CLASS);

    return () => {
      document.body.classList.remove(BODY_CLASS);
    };
  }, [isOpen]);
}

export default useModalBodyLock;
