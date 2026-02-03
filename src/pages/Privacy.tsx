import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-display font-medium mb-8">Privacy Policy</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: January 1, 2025</p>

            <h2 className="text-2xl font-display font-medium mt-8 mb-4">Who we are</h2>
            <p className="mb-4">We are Works App, Inc., doing business as Creators. Our website address is: https://www.trycreators.ai</p>

            <h2 className="text-2xl font-display font-medium mt-8 mb-4">Comments</h2>
            <p className="mb-4">When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.</p>

            <h2 className="text-2xl font-display font-medium mt-8 mb-4">Media</h2>
            <p className="mb-4">If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.</p>

            <h2 className="text-2xl font-display font-medium mt-8 mb-4">Cookies</h2>
            <p className="mb-4">If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.</p>
            <p className="mb-4">If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.</p>
            <p className="mb-4">When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.</p>

            <h2 className="text-2xl font-display font-medium mt-8 mb-4">Embedded content from other websites</h2>
            <p className="mb-4">Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.</p>

            <h2 className="text-2xl font-display font-medium mt-8 mb-4">Who we share your data with</h2>
            <p className="mb-4">If you request a password reset, your IP address will be included in the reset email.</p>

            <h2 className="text-2xl font-display font-medium mt-8 mb-4">What rights you have over your data</h2>
            <p className="mb-4">If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.</p>

            <h2 className="text-2xl font-display font-medium mt-8 mb-4">Our contact address</h2>
            <p className="mb-4">
              Works App, Inc.<br />
              447 Sutter St,<br />
              Ste 405 #3,<br />
              San Francisco,<br />
              CA 94108
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
