"use client";

import { useState, useEffect } from "react";

interface ElapsedTimeProps {
  since: string; // ISO date string
}

export function ElapsedTime({ since }: ElapsedTimeProps) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    function update() {
      const date = new Date(since);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);

      if (diffMin < 1) setElapsed("刚刚");
      else if (diffMin < 60) setElapsed(`${diffMin}分钟前`);
      else {
        const diffHour = Math.floor(diffMin / 60);
        setElapsed(`${diffHour}小时前`);
      }
    }

    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [since]);

  return <span>{elapsed}</span>;
}
