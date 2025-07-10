import "@/styles/globals.css";

import { useState } from "react";

export default function CotacaoPorPeriodo() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [cotacoes, setCotacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const formatarData = (data) => data.replaceAll("-", "");

  const buscar = async () => {
    if (!dataInicio || !dataFim) {
      alert("Por favor, selecione as duas datas.");
      return;
    }

    const url = `https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${formatarData(
      dataInicio
    )}&end_date=${formatarData(dataFim)}`;

    try {
      setCarregando(true);
      setErro(null);
      const resposta = await fetch(url);
      if (!resposta.ok) throw new Error("Erro na resposta da API");
      const dados = await resposta.json();
      setCotacoes(dados);
    } catch (err) {
      console.error("Erro ao buscar cotações:", err);
      setErro("Erro ao buscar dados. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Histórico USD/BRL</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "1rem" }}>
          Data Início:
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>

        <label>
          Data Fim:
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <button onClick={buscar}>Buscar</button>

      {carregando && <p>Carregando dados...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {cotacoes.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: "2rem" }}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Compra (bid)</th>
              <th>Venda (ask)</th>
            </tr>
          </thead>
          <tbody>
            {cotacoes.map((item) => (
              <tr key={item.timestamp}>
                <td>{new Date(item.timestamp * 1000).toLocaleDateString()}</td>
                <td>R$ {Number(item.bid).toFixed(2)}</td>
                <td>R$ {Number(item.ask).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}