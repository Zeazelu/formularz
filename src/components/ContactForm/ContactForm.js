import React, { useState, useEffect } from 'react';
import ContactInputs from './ContactInputs/ContactInputs';
import './ContactForm.css'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agreement_mail: false,
    agreement_call: false,
    agreement_sms: false,
    error_test: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [showMailConsent, setShowMailConsent] = useState(false);
  const [showCallConsent, setShowCallConsent] = useState(false);
  const [showSmsConsent, setShowSmsConsent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    if (name === 'phone') {
      const phoneRegex = /^[0-9]{9}$/;
      setIsPhoneValid(phoneRegex.test(value));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Pole Imię jest wymagane';
    if (!formData.email) errors.email = 'Pole Email jest wymagane';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      errors.email = 'Nieprawidłowy adres e-mail';
    }
    if (!isPhoneValid && formData.phone) errors.phone = 'Nieprawidłowy numer telefonu';

    // Dodanie warunków sprawdzających zgody
    if (!formData.agreement_mail) {
      errors.agreement_mail = 'Zgoda na kontakt mailowy jest wymagana';
    }
    if (isPhoneValid) {
      if (!formData.agreement_call && !formData.agreement_sms) {
        errors.agreement_call = 'Co najmniej jedna zgoda na kontakt telefoniczny lub SMS jest wymagana';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (formData.email && !formErrors.email) {
      setShowMailConsent(true);
    } else {
      setShowMailConsent(false);
    }
  }, [formData.email, formErrors.email]);

  useEffect(() => {
    if (isPhoneValid) {
      setShowCallConsent(true);
      setShowSmsConsent(true);
    } else {
      setShowCallConsent(false);
      setShowSmsConsent(false);
    }
  }, [isPhoneValid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        // Losowa liczba z zakresu 1 do 10 - używamy jej, aby zdecydować, czy wysłać błędny e-mail
        const randomNum = Math.floor(Math.random() * 10) + 1;
  
        const emailToSend = randomNum === 1 ? 'invalid-email' : formData.email;
  
        const response = await fetch('https://test8.it4u.company/sapi/modules/contact/form/40042ce28394dc369948c018b22c534d', {
          method: 'POST',
          body: JSON.stringify({ ...formData, email: emailToSend }), // Zaktualizuj e-mail
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          console.log('Dane zostały przesłane pomyślnie');
        } else {
          const errorResponse = await response.json(); // Odczytaj odpowiedź z serwera
  
          // Jeśli serwer zwrócił komunikat błędu, przypisz go do formData.error_test
          if (errorResponse && errorResponse.errorMessage) {
            setFormData({ ...formData, error_test: errorResponse.errorMessage });
          } else {
            console.error('Błąd podczas wysyłania danych');
          }
        }
      } catch (error) {
        console.error('Błąd podczas komunikacji z serwerem', error);
      }
    }
  };
  

  return (
    <div className="contactform__container">
      <div className="contactform__wrapper">
        <form onSubmit={handleSubmit}>
          <ContactInputs formData={formData} handleInputChange={handleInputChange} formErrors={formErrors} />
          <div className="contactform__consent">
            <label>Wyrażam zgodę na otrzymywanie od Duda Development Sp. z.o.o. SKA z siedzibą w Poznaniu ul. Macieja Palacza 144, 60-278 Poznań, informacji handlowej</label>
          </div>
          <div className="contactform__error">
            {showMailConsent && (
              <div className="contactform__consent">
                <label><input type="checkbox" name="agreement_mail" checked={formData.agreement_mail} onChange={handleInputChange} /><span>w formie elektronicznej (mail) na wskazany adres mailowy</span></label>
              </div>
            )}
          </div>
          <div className="contactform__error">
            {formData.error_test && <span>{formData.error_test}</span>}
          </div>
          <div className="contactform__error">
            {showCallConsent && (
            <div className="contactform__consent">
              <label><input type="checkbox" name="agreement_call" checked={formData.agreement_call} onChange={handleInputChange} /><span>drogą telefoniczną na udostępniony numer telefonu</span></label>
            </div>
            )}
          </div>
          <div className="contactform__error">
          {showSmsConsent && (
            <div className="contactform__consent">
              <label><input type="checkbox" name="agreement_sms" checked={formData.agreement_sms} onChange={handleInputChange} /><span>w formie SMS na udostępniony numer telefonu</span></label>
            </div>
            )}
          </div>
          <div className="contactform__error">
            {(formErrors.agreement_mail || formErrors.agreement_call) && <span>{formErrors.agreement_mail || formErrors.agreement_call}</span>}
            <div className='contactform__submit'>
              <button type="submit">WYŚLIJ</button>
            </div>
          </div>
          <div className="contactform__information">
            <a href='/information'>Kto będzie administratorem Twoich danych osobowych?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
