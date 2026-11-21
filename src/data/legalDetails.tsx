import React from 'react';

export type LegalSectionData = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export const privacyPolicyData: LegalSectionData[] = [
  {
    id: "info-collection",
    title: "1. Information We Collect",
    content: (
      <>
        <p>
          We collect information to provide better educational assistance and personalize your learning experience. The types of data we collect include:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-indigo-500">
          <li><strong>Account Data:</strong> Name, email address, and profile picture provided through third-party authentication services (e.g., Google).</li>
          <li><strong>Educational Profile:</strong> Target universities, selected program studies, and learning progression parameters you define.</li>
          <li><strong>Usage & Interaction Data:</strong> Learning history, wishlist components, chatbot interactions, and quiz results to calibrate our system to your needs.</li>
          <li><strong>Technical Data:</strong> IP addresses, browser information, device identifiers, and platform analytics required for security and performance optimizations.</li>
        </ul>
      </>
    )
  },
  {
    id: "info-usage",
    title: "2. How We Use Your Information",
    content: (
      <>
        <p>Your data is strictly utilized to operate, maintain, and improve the SNBT AI platform. This includes:</p>
        <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-indigo-500">
          <li>Running the Item Response Theory (IRT) algorithms to properly calibrate question difficulties.</li>
          <li>Providing context to our AI logic models to generate personalized explanations and study plans.</li>
          <li>Ensuring session security, authenticating users, and preventing unpermitted usage.</li>
          <li>Sending essential administrative notifications regarding platform updates or account security.</li>
        </ul>
      </>
    )
  },
  {
    id: "third-party",
    title: "3. Third-Party Integrations & AI Models",
    content: (
      <>
        <p>
          We actively utilize third-party Application Programming Interfaces (APIs)—including large language models (LLMs) from providers such as OpenAI and Google—to generate educational content. 
        </p>
        <p className="mt-4">
          When you interact with our AI tutor, your queries and prompt context are transmitted to these providers securely. However, we do not utilize your personal identification data to train these external public models. We strongly advise users not to submit highly sensitive or personally identifiable information within chatbot interfaces.
        </p>
      </>
    )
  },
  {
    id: "data-retention",
    title: "4. Data Retention & Deletion",
    content: (
      <>
        <p>
          Your personal data is retained only for as long as your account remains active or as needed to provide you with our services. 
        </p>
        <p className="mt-4">
          You hold the fundamental right to request the deletion of your account and associated data. You can initiate this request via the application settings or by contacting our support team directly. Upon account deletion, user-generated data will be immediately removed or irreversibly anonymized.
        </p>
      </>
    )
  },
  {
    id: "security",
    title: "5. Security Standards",
    content: (
      <p>
        We restrict access to your personal information to personnel, contractors, and essential third-party service providers who require this data to operate the platform. We employ standard technical safeguards, including Secure Sockets Layer (SSL) encryption, encrypted database storage via Firebase, and secure credential environments. However, no internet transmission or electronic storage is 100% secure.
      </p>
    )
  },
  {
    id: "changes-privacy",
    title: "6. Changes to This Privacy Policy",
    content: (
      <p>
        We reserve the right to revise this Privacy Policy periodically. Significant modifications that materially alter your privacy rights will be communicated through platform notifications or via email prior to becoming effective. Your continued use of SNBT AI following these updates designates your acknowledgment and acceptance of the revised terms.
      </p>
    )
  }
];

export const termsAndConditionsData: LegalSectionData[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <p>
        By registering for, accessing, or using SNBT AI ("the Platform"), you acknowledge that you have read, comprehended, and agreed to be unconditionally bound by these Terms & Conditions. If you do not agree to these terms, you are prohibited from utilizing the platform or its associated educational services.
      </p>
    )
  },
  {
    id: "user-conduct",
    title: "2. User Eligibility & Conduct",
    content: (
      <>
        <p>By utilizing our Platform, you explicitly agree that:</p>
        <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-indigo-500">
          <li>You will provide accurate, current, and complete registration information.</li>
          <li>You will access the platform strictly for personal, non-commercial educational purposes.</li>
          <li>You will not attempt to scrape, data-mine, reverse-engineer, or use automated systems to extract content, questions, or proprietary logic from the platform.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials and will be held liable for all activities occurring under your account.</li>
        </ul>
      </>
    )
  },
  {
    id: "ai-disclaimer",
    title: "3. Disclaimers for AI-Generated Content",
    content: (
      <>
        <p>
          SNBT AI leverages autonomous generative artificial intelligence to produce practice questions, answers, and study explanations dynamically. While we strive for accuracy, users must acknowledge that:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-indigo-500">
          <li>AI-generated materials can occasionally suffer from logical hallucinations, inaccuracies, or incomplete explanations.</li>
          <li>The platform's content is intended as supplementary preparation and does not replace official, verified curricula limits set by governmental or university testing bodies.</li>
          <li>We claim no liability or responsibility for a user's final examination scores resulting from the reliance on our generated study materials.</li>
        </ul>
      </>
    )
  },
  {
    id: "intellectual-property",
    title: "4. Intellectual Property Rights",
    content: (
      <p>
        All foundational platform architecture, design, branding, static content, and underlying algorithms are the exclusive intellectual property of SNBT AI. Although the platform dynamically generates study material using third-party AI models on your behalf, you may not redistribute, repackage, or systematically sell the content generated within the platform.
      </p>
    )
  },
  {
    id: "termination",
    title: "5. Termination & Suspension",
    content: (
      <p>
        We reserve the absolute right to suspend or terminate your access to the platform at our sole discretion, without prior notice, if we determine that you have violated these Terms & Conditions, engaged in fraudulent or abusive activities, or if your usage places an unmanageable load on our infrastructure.
      </p>
    )
  },
  {
    id: "limitation",
    title: "6. Limitation of Liability",
    content: (
      <p>
        To the maximum extent permitted by applicable law, in no event shall SNBT AI, its founders, affiliates, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or digital reputation resulting from your usage of, or inability to utilize, the service.
      </p>
    )
  }
];
