import "./globals.css";
import TopMenu from "@/components/TopMenu";
import ReduxProvider from "@/redux/ReduxProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="m-0">
        <ReduxProvider>
          <TopMenu />
          <div className="pt-16">
            {children}
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}