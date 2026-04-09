"use client";

import { useEffect } from "react";

type BodyClassNameProps = {
  className: string;
};

export function BodyClassName({ className }: BodyClassNameProps) {
  useEffect(() => {
    document.body.classList.add(className);

    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);

  return null;
}
