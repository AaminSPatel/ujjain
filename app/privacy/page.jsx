"use client"
import { motion } from "framer-motion"
import SEOHead from "@/components/SEOHead"
import { useUjjain } from "@/components/context/UjjainContext"

export default function Privacy() {
  const { brand } = useUjjain();

  const sections = [
    {
      title: "1. Introduction",
      content:
        "At Safar Sathi, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, including our website and mobile application.",
    },
    {
      title: "2. Information We Collect",
      content:
        "We collect information you provide directly to us, such as when you create an account, make a booking, or contact us. This includes your name, email address, phone number, payment information, and travel preferences. We also automatically collect certain information about your device and usage of our services.",
    },
    {
      title: "3. How We Use Your Information",
      content:
        "We use the information we collect to provide, maintain, and improve our services; process transactions and send related information; send you technical notices, updates, security alerts, and support messages; respond to your comments, questions, and requests; and communicate with you about products, services, offers, and events.",
    },
    {
      title: "4. Information Sharing and Disclosure",
      content:
        "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with service providers who assist us in operating our website, conducting our business, or servicing you, provided they agree to keep this information confidential.",
    },
    {
      title: "5. Data Security",
      content:
        "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
    },
    {
      title: "6. Your Rights",
      content:
        "You have the right to access, update, or delete your personal information. You may also object to or restrict certain processing of your information. To exercise these rights, please contact us using the information provided below. We will respond to your request within a reasonable timeframe.",
    },
    {
      title: "7. Cookies and Tracking Technologies",
      content:
        "We use cookies and similar tracking technologies to collect and use personal information about you. Cookies are small data files stored on your device. You can control cookies through your browser settings, but disabling cookies may limit your use of our services.",
    },
    {
      title: "8. Third-Party Services",
      content:
        "Our services may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices of these third parties. We encourage you to read the privacy policies of any third-party services you use.",
    },
    {
      title: "9. Children's Privacy",
      content:
        "Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.",
    },
    {
      title: "10. Changes to This Privacy Policy",
      content:
        "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date. Your continued use of our services after any changes constitutes your acceptance of the new Privacy Policy.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Privacy Policy - Safar Sathi"
        description="Read our Privacy Policy to understand how Safar Sathi collects, uses, and protects your personal information."
        keywords="safar sathi privacy, policy, data protection, personal information, cookies"
      />


      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we protect your information.
            </p>
            <div className="mt-8 text-sm text-gray-300">Last updated: January 15, 2024</div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                <h2 className="text-xl font-bold text-blue-800 mb-2">Our Commitment to Privacy</h2>
                <p className="text-blue-700">
                  Safar Sathi is committed to protecting your personal information and being transparent about our practices.
                  This policy explains how we handle your data when you use our travel services.
                </p>
              </div>
            </motion.div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-12 card p-8 bg-gradient-to-br from-orange-50 to-blue-50"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Email:</strong> {brand.email}
                </p>
                <p>
                  <strong>Phone:</strong> {brand.mobile}
                </p>
                <p>
                  <strong>Address:</strong> India
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


    </div>
  )
}
