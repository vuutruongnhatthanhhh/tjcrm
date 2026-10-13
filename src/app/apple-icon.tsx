import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0d",
        }}
      >
        <svg width="62%" height="62%" viewBox="0 0 64 64">
          <polygon
            points="32,8 38.35,23.26 54.83,24.58 42.27,35.34 46.11,51.42 32,42.8 17.89,51.42 21.73,35.34 9.17,24.58 25.65,23.26"
            fill="#ff7a1a"
            stroke="#ff7a1a"
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size
  );
}
