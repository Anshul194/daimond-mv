import "./globals.css";
import Providers from "../store/Providers";
import ClientLayout from "./ClientLayout";

export const metadata = { title: "Diamond", description: "Buy your luxury" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
