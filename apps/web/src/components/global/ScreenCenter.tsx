import React from 'react';

function ScreenCenter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center max-w-[1440px] mx-auto">
      {children}
    </div>
  );
}

export default ScreenCenter;
