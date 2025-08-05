import { useState } from 'react';

function SurveyPage() {
  const [language, setLanguage] = useState('en');
  const [usesTools, setUsesTools] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const labels = {
    en: {
      heading: "Mining Area Safety & Sustainability Survey",
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
    },
    hi: {
      heading: "खनन क्षेत्र सुरक्षा और स्थिरता सर्वेक्षण",
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
    }
  }[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f4f4f6',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '700px', color: '#1f2937' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '0.4rem' }}>
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        <h2
          style={{
            marginBottom: '1.5rem',
            color: '#374151',
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          {labels.heading}
        </h2>

        {submitted ? (
          <div style={{ textAlign: 'center', fontSize: '1.25rem', color: '#10b981' }}>
            ✅ {labels.thankYou}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <input type="text" placeholder={labels.name} style={inputStyle} required />
            <input type="tel" placeholder={labels.phone} style={inputStyle} required />
            <input type="text" placeholder={labels.location} style={inputStyle} required />

            <div>
              <label>{labels.q1}</label>
              <div style={{ marginTop: '0.4rem' }}>
                <input type="radio" name="q1" required /> {labels.yes}
                <input type="radio" name="q1" style={{ marginLeft: '1rem' }} /> {labels.no}
              </div>
            </div>

            <div>
              <label>{labels.q2}</label>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input type="range" min="1" max="5" style={sliderStyle} />
                <div style={emojiRow}>
                  <span>😐 Slight</span>
                  <span>😷 Moderate</span>
                  <span>🤢 Heavy</span>
                </div>
              </div>
            </div>

            <div>
              <label>{labels.q3}</label>
              <div style={{ marginTop: '0.4rem' }}>
                <input type="radio" name="tools" onChange={() => setUsesTools(true)} required /> {labels.yes}
                <input type="radio" name="tools" style={{ marginLeft: '1rem' }} onChange={() => setUsesTools(false)} /> {labels.no}
              </div>
              {usesTools && (
                <input
                  type="text"
                  placeholder={labels.q3a}
                  style={{ ...inputStyle, marginTop: '0.5rem', width: '40%' }}
                />
              )}
            </div>

            <div>
              <label>{labels.q4}</label>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input type="range" min="1" max="5" style={sliderStyle} />
                <div style={emojiRow}>
                  <span>😟 Unsafe</span>
                  <span>😐 Okay</span>
                  <span>😌 Very Safe</span>
                </div>
              </div>
            </div>

            <div>
              <label>{labels.q5}</label>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input type="range" min="1" max="5" style={sliderStyle} />
                <div style={emojiRow}>
                  <span>💨 Polluted</span>
                  <span>😐 Normal</span>
                  <span>🌿 Clean</span>
                </div>
              </div>
            </div>

            <button type="submit" style={submitStyle}>{labels.submit}</button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.6rem 1rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  background: '#ffffff',
};

const sliderStyle = {
  width: '100%',
  marginTop: '0.5rem',
  accentColor: '#6b7280',
};

const emojiRow = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  fontSize: '0.9rem',
  marginTop: '0.3rem',
};

const submitStyle = {
  padding: '0.7rem',
  borderRadius: '6px',
  backgroundColor: '#64748b',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '1rem',
};

export default SurveyPage;
