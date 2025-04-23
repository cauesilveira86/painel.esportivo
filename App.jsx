
// Painel Esportivo Web Integrado com API-Football
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

const API_KEY = "1bf61ce5ae393b8889bcd8ae084fd928";
const BASE_URL = "https://v3.football.api-sports.io";

export default function PainelEsportivo() {
  const [aba, setAba] = useState("futebol");
  const [dados, setDados] = useState([]);

  async function buscarFutebolAoVivo() {
    const response = await fetch(`${BASE_URL}/fixtures?live=all`, {
      headers: {
        "x-apisports-key": API_KEY,
      },
    });
    const data = await response.json();
    const ligasPermitidas = [2, 3, 39, 61, 78, 135, 140, 94, 203, 848, 4, 5, 6, 7, 1, 15, 132];
    const jogosFiltrados = data.response.filter((jogo) =>
      ligasPermitidas.includes(jogo.league.id)
    );
    return jogosFiltrados.map((jogo) => ({
      timeCasa: { nome: jogo.teams.home.name, escudo: jogo.teams.home.logo },
      timeFora: { nome: jogo.teams.away.name, escudo: jogo.teams.away.logo },
      placarCasa: jogo.goals.home,
      placarFora: jogo.goals.away,
      campeonato: jogo.league.name,
      tempo: jogo.fixture.status.elapsed + "'",
    }));
  }

  async function buscarNBAAoVivo() {
    const response = await fetch(`${BASE_URL}/games?league=12&season=2024&live=all`, {
      headers: { "x-apisports-key": API_KEY },
    });
    const data = await response.json();
    return data.response.map((jogo) => ({
      timeCasa: { nome: jogo.teams.home.name, escudo: jogo.teams.home.logo },
      timeFora: { nome: jogo.teams.away.name, escudo: jogo.teams.away.logo },
      placarCasa: jogo.scores.home.total,
      placarFora: jogo.scores.away.total,
      campeonato: jogo.league.name,
      tempo: jogo.status.long,
    }));
  }

  async function buscarNFLAoVivo() {
    const response = await fetch(`${BASE_URL}/games?league=28&season=2024&live=all`, {
      headers: { "x-apisports-key": API_KEY },
    });
    const data = await response.json();
    return data.response.map((jogo) => ({
      timeCasa: { nome: jogo.teams.home.name, escudo: jogo.teams.home.logo },
      timeFora: { nome: jogo.teams.away.name, escudo: jogo.teams.away.logo },
      placarCasa: jogo.scores.home.total,
      placarFora: jogo.scores.away.total,
      campeonato: jogo.league.name,
      tempo: jogo.status.long,
    }));
  }

  async function carregarDados() {
    if (aba === "futebol") setDados(await buscarFutebolAoVivo());
    else if (aba === "nba") setDados(await buscarNBAAoVivo());
    else if (aba === "nfl") setDados(await buscarNFLAoVivo());
  }

  useEffect(() => {
    carregarDados();
    const audio = new Audio("/sons/gol.mp3");
    const intervalo = setInterval(async () => {
      const novosDados = await (aba === "futebol"
        ? buscarFutebolAoVivo()
        : aba === "nba"
        ? buscarNBAAoVivo()
        : buscarNFLAoVivo());
      if (JSON.stringify(novosDados) !== JSON.stringify(dados)) {
        audio.play();
        setDados(novosDados);
      }
    }, 15000);
    return () => clearInterval(intervalo);
  }, [aba]);

  return (
    <div className="p-4 w-full min-h-screen bg-white text-black">
      <div className="flex justify-center gap-4 mb-6">
        <Button onClick={() => setAba("futebol")} variant={aba === "futebol" ? "default" : "outline"}>Futebol</Button>
        <Button onClick={() => setAba("nba")} variant={aba === "nba" ? "default" : "outline"}>NBA</Button>
        <Button onClick={() => setAba("nfl")} variant={aba === "nfl" ? "default" : "outline"}>NFL</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dados.length === 0 ? (
          <p className="text-center col-span-full">Nenhum jogo ao vivo no momento.</p>
        ) : (
          dados.map((jogo, i) => (
            <Card key={i} className="rounded-2xl shadow-md">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="flex items-center gap-4">
                  <img src={jogo.timeCasa.escudo} alt={jogo.timeCasa.nome} className="w-10 h-10" />
                  <strong>{jogo.timeCasa.nome}</strong>
                  <span className="text-xl font-bold">{jogo.placarCasa} x {jogo.placarFora}</span>
                  <strong>{jogo.timeFora.nome}</strong>
                  <img src={jogo.timeFora.escudo} alt={jogo.timeFora.nome} className="w-10 h-10" />
                </div>
                <p className="text-sm mt-2">{jogo.campeonato} - {jogo.tempo}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
