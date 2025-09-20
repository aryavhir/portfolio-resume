
import ScrambledText from "../asset/text-animation/ScrambledText";
import linkedinIcon from "../asset/img/nav-icon1.svg";
import githubIcon from "../asset/img/nav-icon2.svg";
import instagramIcon from "../asset/img/nav-icon3.svg";
export const Footer = () => {
  return (
    <footer id="footer" className="footer">

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12, marginTop: '13%' }}>
        <ScrambledText className="scrambled-text-demo" radius={100} duration={1.2} speed={0.5}>
          Have a Figma? I’ll turn it into a fast app.<br />
          Night owl,manga addict and someone who definitely has too many browser tabs open right now.
        </ScrambledText>
    
        <div className="social-icon" style={{ display: 'flex', alignItems: 'center',justifyContent: 'center' }}>
          <a href="https://www.linkedin.com/in/" target="_blank" rel="noreferrer"><img src={linkedinIcon} alt="LinkedIn" /></a>
          <a href="https://github.com/aryavhir" target="_blank" rel="noreferrer"><img src={githubIcon} alt="GitHub" /></a>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer"><img src={instagramIcon} alt="Instagram" /></a>
        </div>
      </div>
    </footer>
  );
};
