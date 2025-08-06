import { useState } from "react";
import { FaCheckCircle, FaClipboardList } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming shadcn components are in this path

function SurveyPage() {
  const [language, setLanguage] = useState("en");
  const [usesTools, setUsesTools] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const labels = {
    en: {
      heading: "Safety & Sustainability Survey",
      subheading:
        "Your feedback is vital for improving our community's well-being and environmental standards in the mining area.",
      name: "Name",
      phone: "Phone Number",
      location: "Your Location",
      q1: "Do you live near or work in the mining area?",
      q2: "Do you notice dust, smoke, or pollution around the mine?",
      q3: "Do you use any tools for safety or sustainability?",
      q3a: "Please specify the tools you use:",
      q4: "How safe do you feel around or inside the mining area?",
      q5: "How clean or environmentally friendly does the mine seem?",
      submit: "Submit Survey",
      yes: "Yes",
      no: "No",
      thankYou: "Thank you for submitting the survey!",
      polluted: "Polluted",
      normal: "Normal",
      clean: "Clean",
      unsafe: "Unsafe",
      okay: "Okay",
      verySafe: "Very Safe",
      slight: "Slight",
      moderate: "Moderate",
      heavy: "Heavy",
    },
    hi: {
      heading: "सुरक्षा और स्थिरता सर्वेक्षण",
      subheading:
        "हमारे समुदाय की भलाई और खनन क्षेत्र में पर्यावरणीय मानकों को बेहतर बनाने के लिए आपकी प्रतिक्रिया महत्वपूर्ण है।",
      name: "नाम",
      phone: "फ़ोन नंबर",
      location: "आपका स्थान",
      q1: "क्या आप खान क्षेत्र के पास रहते हैं या काम करते हैं?",
      q2: "क्या आपको खान के आसपास धूल, धुआं या प्रदूषण दिखाई देता है?",
      q3: "क्या आप सुरक्षा या स्थिरता के लिए कोई उपकरण उपयोग करते हैं?",
      q3a: "कृपया उपयोग किए गए उपकरणों को निर्दिष्ट करें:",
      q4: "आप खान क्षेत्र के आसपास या अंदर कितनी सुरक्षित महसूस करते हैं?",
      q5: "खान आपको कितना स्वच्छ या पर्यावरण के अनुकूल लगता है?",
      submit: "सर्वेक्षण सबमिट करें",
      yes: "हाँ",
      no: "नहीं",
      thankYou: "सर्वेक्षण सबमिट करने के लिए धन्यवाद!",
      polluted: "प्रदूषित",
      normal: "सामान्य",
      clean: "स्वच्छ",
      unsafe: "असुरक्षित",
      okay: "ठीक है",
      verySafe: "बहुत सुरक्षित",
      slight: "थोड़ा",
      moderate: "मध्यम",
      heavy: "भारी",
    },
  }[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle form data submission to a backend
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-end mb-6">
            {/* --- UPDATED: Swapped native select for shadcn Select --- */}
            <Select value={language} onValueChange={(value) => setLanguage(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* --- UPDATED: Enhanced Heading --- */}
          <div className="text-center mb-12">
            <FaClipboardList className="mx-auto h-10 w-10 text-orange-400 mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              {labels.heading}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">{labels.subheading}</p>
          </div>

          {submitted ? (
            <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
              <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              <p className="text-2xl font-bold text-green-700">{labels.thankYou}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 gap-6">
                <input
                  type="text"
                  placeholder={labels.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
                <input
                  type="tel"
                  placeholder={labels.phone}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
                <input
                  type="text"
                  placeholder={labels.location}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div className="border-t border-gray-200 pt-8">
                <label className="block text-lg font-semibold text-gray-700">{labels.q1}</label>
                <div className="mt-4 flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="q1"
                      className="text-orange-600 focus:ring-orange-500"
                      required
                    />
                    <span>{labels.yes}</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="q1"
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>{labels.no}</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <label className="block text-lg font-semibold text-gray-700">{labels.q2}</label>
                <div className="mt-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    defaultValue="3"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between w-full text-sm text-gray-600 mt-2">
                    <span>😐 {labels.slight}</span>
                    <span>😷 {labels.moderate}</span>
                    <span>🤢 {labels.heavy}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <label className="block text-lg font-semibold text-gray-700">{labels.q3}</label>
                <div className="mt-4 flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tools"
                      onChange={() => setUsesTools(true)}
                      className="text-orange-600 focus:ring-orange-500"
                      required
                    />
                    <span>{labels.yes}</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tools"
                      onChange={() => setUsesTools(false)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>{labels.no}</span>
                  </label>
                </div>
                {usesTools && (
                  <input
                    type="text"
                    placeholder={labels.q3a}
                    className="mt-4 w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  />
                )}
              </div>

              <div className="border-t border-gray-200 pt-8">
                <label className="block text-lg font-semibold text-gray-700">{labels.q4}</label>
                <div className="mt-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    defaultValue="3"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between w-full text-sm text-gray-600 mt-2">
                    <span>😟 {labels.unsafe}</span>
                    <span>😐 {labels.okay}</span>
                    <span>😌 {labels.verySafe}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <label className="block text-lg font-semibold text-gray-700">{labels.q5}</label>
                <div className="mt-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    defaultValue="3"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between w-full text-sm text-gray-600 mt-2">
                    <span>💨 {labels.polluted}</span>
                    <span>😐 {labels.normal}</span>
                    <span>🌿 {labels.clean}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  {labels.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default SurveyPage;
