import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-display font-medium mb-8">Terms and Conditions</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="mb-6">Please read these terms and conditions carefully before using Our Service.</p>

            <h2 className="text-2xl font-display font-medium mt-8 mb-4">Interpretation and Definitions</h2>
            
            <h3 className="text-xl font-display font-medium mt-6 mb-3">Interpretation</h3>
            <p className="mb-4">The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

            <h3 className="text-xl font-display font-medium mt-6 mb-3">Definitions</h3>
            <p className="mb-4">For the purposes of these Terms and Conditions:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
              <li><strong>Country</strong> refers to: The United States of America</li>
              <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Works App, Inc. 447 Sutter St, Ste 405 #3, San Francisco, CA 94108.</li>
              <li><strong>Content</strong> refers to content such as text, images, or other information that can be posted, uploaded, linked to or otherwise made available by You, regardless of the form of that content.</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
              <li><strong>Service</strong> refers to the Website.</li>
              <li><strong>Subscriptions</strong> refer to the services or access to the Service offered on a subscription basis by the Company to You.</li>
              <li><strong>Terms and Conditions</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
              <li><strong>Third-party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</li>
              <li><strong>Website</strong> refers to Creators, accessible from https://www.trycreators.ai</li>
              <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>

            <h2 className="text-2xl font-display font-medium mt-8 mb-4">Acknowledgment</h2>
            <p className="mb-4">These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
            <p className="mb-4">Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
            <p className="mb-4">By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
            <p className="mb-4">You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.</p>

            <h2 className="text-2xl font-display font-medium mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">If you have any questions about these Terms and Conditions, You can contact us at <a href="mailto:alex@trycreators.ai" className="text-primary hover:underline">alex@trycreators.ai</a></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
