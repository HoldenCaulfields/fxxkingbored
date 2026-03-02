"use client";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { COLLEGE_DATA } from "./data";

interface MarkerCDNProps {
  onClick: () => void;
}

function createCollegeIcon() {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
            <div class="relative flex flex-col items-center justify-center" style="transform: translate(-50%, -50%);">
              
              <!-- Animated Rings -->
              <div class="absolute w-24 h-24 border-2 border-dashed border-rose-500 rounded-full 
                          animate-spin opacity-40"
                   style="animation-duration: 12s;">
              </div>
              
              <div class="absolute w-20 h-20 border-2 border-dashed border-rose-400 rounded-full 
                          animate-spin opacity-30"
                   style="animation-duration: 8s; animation-direction: reverse;">
              </div>
              
              <!-- Glow Effects -->
              <div class="absolute w-16 h-16 bg-rose-500 rounded-full animate-ping opacity-20"></div>
              <div class="absolute w-18 h-18 bg-rose-400 rounded-full animate-pulse opacity-10"></div>
              
              <!-- Main Marker -->
              <div class="relative w-16 h-16 rounded-full 
                          shadow-[0_0_30px_rgba(244,63,94,0.6),0_10px_20px_rgba(0,0,0,0.4)] 
                          flex items-center justify-center z-10 
                          transition-all duration-500 hover:scale-110 hover:shadow-[0_0_40px_rgba(244,63,94,0.8)]
                          bg-gradient-to-br from-rose-500 via-rose-600 to-rose-800">
                  <div class="absolute inset-0 rounded-full bg-white flex items-center justify-center
                      shadow-inner border border-slate-100 overflow-hidden">
                      <img
                          src="${COLLEGE_DATA.avatar}"
                          class="w-full h-full object-cover"
                          alt="School logo"
                      />
                  </div>
              </div>
              
              <!-- Label -->
              <div class="absolute top-full mt-4 pointer-events-none">
                <div class="relative px-4 py-1 bg-white border-2 border-rose-300 rounded-full shadow-2xl flex flex-col items-center backdrop-blur-md">
                  <span class="text-[12px] font-bold text-rose-700 whitespace-nowrap tracking-wider">
                    Cao Đẳng Nghề Ninh Thuận
                  </span>
                  <div class="absolute -top-1 w-2 h-2 bg-white rotate-45 border-l border-t border-rose-300"></div>
                </div>
              </div>
            </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export default function MarkerCDN({ onClick }: MarkerCDNProps) {
  return (
    <Marker
      position={COLLEGE_DATA.location}
      icon={createCollegeIcon()}
      zIndexOffset={1000}
      eventHandlers={{ click: onClick }}
    />
  );
}
