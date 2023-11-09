import React from "react";
import './ContactInputs.css'

const ContactInputs = ({ formData, handleInputChange, formErrors}) => (
    <div className="contactinputs__container">
      <div className="contactinputs__wrapper">
        <div>
          <input  type="text" name="name" placeholder="IMIĘ I NAZWISKO" value={formData.name} onChange={handleInputChange} />
          {formErrors.name && <span>{formErrors.name}</span>}
        </div>
        <div>
          <input type="tel" name="phone" placeholder="TELEFON" value={formData.phone} onChange={handleInputChange} />
          {formErrors.phone && <span>{formErrors.phone}</span>}
        </div>
        <div>
          <input type="email" name="email" placeholder="EMAIL" value={formData.email} onChange={handleInputChange} />
          {formErrors.email && <span>{formErrors.email}</span>}
        </div>
      </div>
    </div>
)
export default ContactInputs;