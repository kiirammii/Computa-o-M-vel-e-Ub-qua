import { useState } from "react";
import { jsPDF } from "jspdf";

function App() {
    const [form, setForm] = useState({
        nome: "",
        salarioBruto: "",
        titulares: "1 titular",
        dependentes: 0,
        irs: "",
        subsidioAlimentacao: "",
        segurancaSocial: "11%", // padrao
    });

    const [errors, setErrors] = useState({});
    const [resultado, setResultado] = useState(null);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    // obrigatorio
    function validate() {
        const newErrors = {};
        if (!form.nome) newErrors.nome = "Nome é obrigatório";
        if (!form.salarioBruto) newErrors.salarioBruto = "Salário bruto é obrigatório";
        if (!form.irs) newErrors.irs = "Escalão IRS é obrigatório";
        if (!form.subsidioAlimentacao) newErrors.subsidioAlimentacao = "Subsídio de alimentação é obrigatório";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // calculo
    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        const salario = parseFloat(form.salarioBruto);
        const irs = parseFloat(form.irs);
        const subsidio = parseFloat(form.subsidioAlimentacao);
        const segSocialPercent = parseFloat(form.segurancaSocial.replace("%", "")) / 100;

        const descontoIRS = (salario * irs) / 100;
        const descontoSegSocial = salario * segSocialPercent;
        const salarioLiquido = salario - descontoIRS - descontoSegSocial + subsidio;

        setResultado({
            salario,
            descontoIRS,
            descontoSegSocial,
            subsidio,
            salarioLiquido,
        });
    }

    // limpar
    function resetForm() {
        setForm({
            nome: "",
            salarioBruto: "",
            titulares: "1 titular",
            dependentes: 0,
            irs: "",
            subsidioAlimentacao: "",
            segurancaSocial: "11%",
        });
        setErrors({});
        setResultado(null);
    }

    // pdf
    function gerarPDF() {
        if (!resultado) return;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`Simulador de Vencimento Líquido`, 10, 15);
        doc.setFontSize(12);
        doc.text(`Nome: ${form.nome}`, 10, 30);
        doc.text(`Titulares: ${form.titulares}`, 10, 40);
        doc.text(`Dependentes: ${form.dependentes}`, 10, 50);

        doc.text(`Salário Bruto: ${resultado.salario.toFixed(2)}€`, 10, 70);
        doc.text(`IRS (${form.irs}%): -${resultado.descontoIRS.toFixed(2)}€`, 10, 80);
        doc.text(`Segurança Social (${form.segurancaSocial}): -${resultado.descontoSegSocial.toFixed(2)}€`, 10, 90);
        doc.text(`Subsídio Alimentação: +${resultado.subsidio.toFixed(2)}€`, 10, 100);
        doc.text(`-------------------------------------`, 10, 110);
        doc.text(`Salário Líquido: ${resultado.salarioLiquido.toFixed(2)}€`, 10, 120);

        doc.save("simulacao_vencimento.pdf");
    }

    return (
        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
        <h1>Simulador de Vencimento Líquido</h1>

        <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
        />
        {errors.nome && <p style={{ color: "red" }}>{errors.nome}</p>}
        <br />

        <input
            type="number"
            name="salarioBruto"
            placeholder="Salário Bruto (€)"
            value={form.salarioBruto}
            onChange={handleChange}
        />
        {errors.salarioBruto && <p style={{ color: "red" }}>{errors.salarioBruto}</p>}
        <br />

        <select name="titulares" value={form.titulares} onChange={handleChange}>
            <option value="1 titular">1 Titular</option>
            <option value="2 titulares">2 Titulares</option>
        </select>
        <br />

        <input
            type="number"
            name="dependentes"
            placeholder="Número de Dependentes"
            value={form.dependentes}
            onChange={handleChange}
        />
        <br />

        <input
            type="number"
            name="irs"
            placeholder="Escalão IRS (%)"
            value={form.irs}
            onChange={handleChange}
        />
        {errors.irs && <p style={{ color: "red" }}>{errors.irs}</p>}
        <br />


        <input
            type="number"
            name="subsidioAlimentacao"
            placeholder="Subsídio de Alimentação (€)"
            value={form.subsidioAlimentacao}
            onChange={handleChange}
        />
        {errors.subsidioAlimentacao && <p style={{ color: "red" }}>{errors.subsidioAlimentacao}</p>}
        <br />

        <input
            type="text"
            name="segurancaSocial"
            placeholder="Segurança Social (%)"
            value={form.segurancaSocial}
            onChange={handleChange}
        />
        <br />


        <button type="submit">Calcular</button>
        <button type="button" onClick={resetForm} style={{ marginLeft: "10px" }}>
            Reset
        </button>


        {resultado && (
            <div style={{ marginTop: "20px" }}>
            <h2>Resultado:</h2>
            <p>Salário Bruto: {resultado.salario.toFixed(2)}€</p>
            <p>IRS: -{resultado.descontoIRS.toFixed(2)}€</p>
            <p>Segurança Social: -{resultado.descontoSegSocial.toFixed(2)}€</p>
            <p>Subsídio Alimentação: +{resultado.subsidio.toFixed(2)}€</p>
            <hr/>
            <p><strong>Salário Líquido: {resultado.salarioLiquido.toFixed(2)}€</strong></p>
            <button onClick={gerarPDF}>Gerar PDF</button>
            </div>
        )}
        </form>
    );
}

export default App;
