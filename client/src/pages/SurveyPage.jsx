import { useState } from "react";

function SurveyPage() {
  const [language, setLanguage] = useState("en");
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
      heading:
        "рдЦрдирди рдХреНрд╖реЗрддреНрд░ рд╕реБрд░рдХреНрд╖рд╛ рдФрд░ рд╕реНрдерд┐рд░рддрд╛ рд╕рд░реНрд╡реЗрдХреНрд╖рдг",
      name: "рдирд╛рдо",
      phone: "рдлрд╝реЛрди рдирдВрдмрд░",
      location: "рдЖрдкрдХрд╛ рд╕реНрдерд╛рди",
      q1: "рдХреНрдпрд╛ рдЖрдк рдЦрд╛рди рдХреНрд╖реЗрддреНрд░ рдХреЗ рдкрд╛рд╕ рд░рд╣рддреЗ рд╣реИрдВ рдпрд╛ рдХрд╛рдо рдХрд░рддреЗ рд╣реИрдВ?",
      q2: "рдХреНрдпрд╛ рдЖрдкрдХреЛ рдЦрд╛рди рдХреЗ рдЖрд╕рдкрд╛рд╕ рдзреВрд▓, рдзреБрдЖрдВ рдпрд╛ рдкреНрд░рджреВрд╖рдг рджрд┐рдЦрд╛рдИ рджреЗрддрд╛ рд╣реИ?",
      q3: "рдХреНрдпрд╛ рдЖрдк рд╕реБрд░рдХреНрд╖рд╛ рдпрд╛ рд╕реНрдерд┐рд░рддрд╛ рдХреЗ рд▓рд┐рдП рдХреЛрдИ рдЙрдкрдХрд░рдг рдЙрдкрдпреЛрдЧ рдХрд░рддреЗ рд╣реИрдВ?",
      q3a: "рдХреГрдкрдпрд╛ рдЙрдкрдпреЛрдЧ рдХрд┐рдП рдЧрдП рдЙрдкрдХрд░рдгреЛрдВ рдХреЛ рдирд┐рд░реНрджрд┐рд╖реНрдЯ рдХрд░реЗрдВ:",
      q4: "рдЖрдк рдЦрд╛рди рдХреНрд╖реЗрддреНрд░ рдХреЗ рдЖрд╕рдкрд╛рд╕ рдпрд╛ рдЕрдВрджрд░ рдХрд┐рддрдиреА рд╕реБрд░рдХреНрд╖рд┐рдд рдорд╣рд╕реВрд╕ рдХрд░рддреЗ рд╣реИрдВ?",
      q5: "рдЦрд╛рди рдЖрдкрдХреЛ рдХрд┐рддрдирд╛ рд╕реНрд╡рдЪреНрдЫ рдпрд╛ рдкрд░реНрдпрд╛рд╡рд░рдг рдХреЗ рдЕрдиреБрдХреВрд▓ рд▓рдЧрддрд╛ рд╣реИ?",
      submit: "рд╕рд░реНрд╡реЗрдХреНрд╖рдг рд╕рдмрдорд┐рдЯ рдХрд░реЗрдВ",
      yes: "рд╣рд╛рдБ",
      no: "рдирд╣реАрдВ",
      thankYou:
        "рд╕рд░реНрд╡реЗрдХреНрд╖рдг рд╕рдмрдорд┐рдЯ рдХрд░рдиреЗ рдХреЗ рд▓рд┐рдП рдзрдиреНрдпрд╡рд╛рдж!",
    },
  }[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f4f6",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "700px", color: "#1f2937" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: "0.4rem" }}
          >
            <option value="en">English</option>
            <option value="hi">рд╣рд┐рдиреНрджреА</option>
          </select>
        </div>

        <h2
          style={{
            marginBottom: "1.5rem",
            color: "#374151",
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          {labels.heading}
        </h2>

        {submitted ? (
          <div style={{ textAlign: "center", fontSize: "1.25rem", color: "#10b981" }}>
            тЬЕ {labels.thankYou}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <input type="text" placeholder={labels.name} style={inputStyle} required />
            <input type="tel" placeholder={labels.phone} style={inputStyle} required />
            <input type="text" placeholder={labels.location} style={inputStyle} required />

            <div>
              <label>{labels.q1}</label>
              <div style={{ marginTop: "0.4rem" }}>
                <input type="radio" name="q1" required /> {labels.yes}
                <input type="radio" name="q1" style={{ marginLeft: "1rem" }} /> {labels.no}
              </div>
            </div>

            <div>
              <label>{labels.q2}</label>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <input type="range" min="1" max="5" style={sliderStyle} />
                <div style={emojiRow}>
                  <span>ЁЯШР Slight</span>
                  <span>ЁЯШ╖ Moderate</span>
                  <span>ЁЯдв Heavy</span>
                </div>
              </div>
            </div>

            <div>
              <label>{labels.q3}</label>
              <div style={{ marginTop: "0.4rem" }}>
                <input type="radio" name="tools" onChange={() => setUsesTools(true)} required />{" "}
                {labels.yes}
                <input
                  type="radio"
                  name="tools"
                  style={{ marginLeft: "1rem" }}
                  onChange={() => setUsesTools(false)}
                />{" "}
                {labels.no}
              </div>
              {usesTools && (
                <input
                  type="text"
                  placeholder={labels.q3a}
                  style={{ ...inputStyle, marginTop: "0.5rem", width: "40%" }}
                />
              )}
            </div>

            <div>
              <label>{labels.q4}</label>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <input type="range" min="1" max="5" style={sliderStyle} />
                <div style={emojiRow}>
                  <span>ЁЯШЯ Unsafe</span>
                  <span>ЁЯШР Okay</span>
                  <span>ЁЯШМ Very Safe</span>
                </div>
              </div>
            </div>

            <div>
              <label>{labels.q5}</label>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <input type="range" min="1" max="5" style={sliderStyle} />
                <div style={emojiRow}>
                  <span>ЁЯТи Polluted</span>
                  <span>ЁЯШР Normal</span>
                  <span>ЁЯМ┐ Clean</span>
                </div>
              </div>
            </div>

            <button type="submit" style={submitStyle}>
              {labels.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "0.6rem 1rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
};

const sliderStyle = {
  width: "100%",
  marginTop: "0.5rem",
  accentColor: "#6b7280",
};

const emojiRow = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  fontSize: "0.9rem",
  marginTop: "0.3rem",
};

const submitStyle = {
  padding: "0.7rem",
  borderRadius: "6px",
  backgroundColor: "#64748b",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  marginTop: "1rem",
};

export default SurveyPage;
