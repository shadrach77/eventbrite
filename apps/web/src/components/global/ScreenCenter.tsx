import React from 'react';

function ScreenCenter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center max-w-[1440px] min-h-screen mx-auto">
      {children}
    </div>
  );
}

export default ScreenCenter;
