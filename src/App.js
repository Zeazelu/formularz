import ContactForm from './components/ContactForm/ContactForm';
import './App.css';

function App() {
  return (
    <div className='app__container'>
      <div className='app__wrapper'>
        <h2>Czy już widzisz tutaj swój nowy dom? Skontaktuj się z nami</h2>
        <h2>i porozmawiajmy o ofercie na działki!</h2>
        <ContactForm />
      </div>
    </div>
  );
}

export default App;
