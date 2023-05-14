import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/Field.css';

const Signup = () =>
{
    const [selectedDate, setSelectedDate] = useState('');
    const [registerNumber, setRegisterNumber] = useState('');
    const registerNumberRef = useRef('');

    const handleRegisterNumberChange = (event) => {
        const input = event.target.value;
        const cleanedInput = input.replace(/\D/g, '');
        
        // Formatter l'entrée pour correspondre au format XX.XX.XX-XXX.XX
        let formattedInput = cleanedInput.slice(0, 2);
        if (cleanedInput.length > 2) {
            formattedInput += '.' + cleanedInput.slice(2, 4);
        }
        if (cleanedInput.length > 4) {
            formattedInput += '.' + cleanedInput.slice(4, 6);
        }
        if (cleanedInput.length > 6) {
            formattedInput += '-' + cleanedInput.slice(6, 9);
        }
        if (cleanedInput.length > 9) {
            formattedInput += '.' + cleanedInput.slice(9, 11);
        }

        // Changer la date de naissance en fonction du numéro de registre national
        console.log(cleanedInput.length);
        if (cleanedInput.length === 6) {
            // Récupérer l'année sous la forme YYYY (ex: 90 => 1990)
            const year = cleanedInput.substr(0, 2);
            // Récupérer le mois (ex: 01 => 1)
            const month = cleanedInput.substr(2, 2).replace(/^0+/, '');
            // Récupérer le jour (ex: 01 => 1)
            const day = cleanedInput.substr(4, 2).replace(/^0+/, '');
            // Vérifier que le mois et le jour sont valides
            if (month < 1 || month > 12 || day < 1 || day > 31) {
                return;
            }
            const date = new Date(2000 + parseInt(year), month - 1, day);
            // Vérifier que la date est valide (antérieur à aujourd'hui)
            if (date > new Date()) {
                return;
            }
            setSelectedDate(date);
        }
        setRegisterNumber(formattedInput);
    };
    
    
      
      
      

      const handleDateChange = (date) => {
        setSelectedDate(date);
        
        // Modifier le numéro de registre national en fonction de la date de naissance
        if (date) {
            // Récupérer l'année sous la forme YY (ex: 1990 => 90)
            const year = date.getFullYear().toString().substr(-2);
            // Récupérer le mois (ex: 1 => 01)
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            // Récupérer le jour (ex: 1 => 01)
            const day = date.getDate().toString().padStart(2, '0');
            const registerNumber = `${day}.${month}.${year}`;
            setRegisterNumber(registerNumber);
        }
    };

    const handleRegisterNumberClick = () => {
        // Vérifier que la date de naissance est bien définie
        if (!selectedDate) {
            return;
        }
        // Positionner le curseur après le jour, le mois et l'année
        if (registerNumberRef.current) {
            // Chercher le premier 0 après le jour, le mois et l'année
            const rest = registerNumberRef.current.value.substr(9);
            const position = rest.search(/0/);
            // Positionner le curseur après le jour, le mois et l'année
            registerNumberRef.current.setSelectionRange(position + 9, position + 9);
        }
      };
      

    return(
        <div>
            <h2 className="title is-2">Inscription :</h2>

            <div className="field">
                <label className="label">Email</label>
                <div className="control">
                    <input className="input form-field" type="email" placeholder="e.g. alexsmith@gmail.com"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Mot de passe</label>
                <div className="control">
                    <input className="input form-field" type="password" placeholder="********"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Confirmer le mot de passe</label>
                <div className="control">
                    <input className="input form-field" type="password" placeholder="********"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Nom</label>
                <div className="control">
                    <input className="input form-field" type="text" placeholder="e.g. Smith"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Prénom</label>
                <div className="control">
                    <input className="input form-field" type="text" placeholder="e.g. Alex"/>
                </div>
            </div>

            <label htmlFor="datePicker" className="label"> Date de naissance</label>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                className="form-field"
            />


            <div className="field">
                <label className="label">Numéro de registre national</label>
                <div className="control">
                <input
                    className="input form-field"
                    type="text"
                    placeholder="e.g. 00.00.00-000.00"
                    value={registerNumber}
                    onChange={handleRegisterNumberChange}
                    ref={registerNumberRef}
                    onClick={handleRegisterNumberClick}
                    maxLength="14" // Limiter la longueur de l'entrée à 14 caractères (11 chiffres + 3 séparateurs)
                />
                </div>
            </div>

            <button>Créer le compte</button>
        </div>
    )
}
export default Signup;