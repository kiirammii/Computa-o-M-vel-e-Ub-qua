import { useState } from "react";

function App() {
    // Step 1: Create state for the counter
    const [age, setAge] = useState(0)

    // Step 2: Functions to modify the counter
    function calculate() {
        const birthdate = document.getElementById("birthdate").value;
        if (birthdate) {
        const birthDate = new Date(birthdate);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
        setAge(calculatedAge);
        }
    }

  // Step 3: Render
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Calculadora de Idade</h1>
      <input type="date" id="birthdate" />
      <button onClick={calculate} style={{ margin: "5px" }}>Calcular</button>
      <p>{age ? `você tem ${age} anos!` : ""}</p>
    </div>
  );
}

export default App;