import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt =
  "Frank Ncube — Computer Information Sciences student building software, AI systems, and digital products.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#090b0a",
          padding: "96px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              width: 18,
              height: 18,
              borderRadius: 5,
              backgroundColor: "#74f79a",
              marginRight: 16,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#74f79a",
              letterSpacing: 6,
            }}
          >
            PORTFOLIO
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 116,
            fontWeight: 600,
            color: "#f4f7f4",
            lineHeight: 1,
          }}
        >
          {siteConfig.name}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 32,
            maxWidth: 940,
            fontSize: 34,
            color: "#9da69f",
            lineHeight: 1.4,
          }}
        >
          {siteConfig.description}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
