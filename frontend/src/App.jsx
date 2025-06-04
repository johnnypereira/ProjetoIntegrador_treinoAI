
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    nome: '',
    nascimento: '',
    altura: '',
    peso: '',
    diasTreino: '',
    divisao: 'separado',
    objetivo: 'Ganho de massa muscular'
  });

  const [treino, setTreino] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validarFormulario = () => {
    const camposObrigatorios = ['nome', 'nascimento', 'altura', 'peso', 'diasTreino'];
    for (const campo of camposObrigatorios) {
      if (!formData[campo]) {
        setErro('Por favor, preencha todos os campos obrigatórios.');
        return false;
      }
    }
    setErro('');
    return true;
  };

  const gerarTreino = async () => {
    if (!validarFormulario()) return;
    setCarregando(true);

    try {
      const res = await axios.post('http://localhost:3000/api/treino', formData);
      setTreino(res.data.treino);
    } catch (error) {
      console.error('Erro ao gerar treino:', error);
      setTreino('Erro ao gerar treino. Verifique o backend.');
    } finally {
      setCarregando(false);
    }
  };

  const exportarPdf = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/exportar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treino })
      });
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'meu-treino.pdf';
      link.click();
    } catch (error) {
      alert('Erro ao exportar PDF');
    }
  };

  const compartilharWhatsapp = () => {
    const mensagem = encodeURIComponent(`Confira meu treino personalizado:\n\n${treino}`);
    const url = `https://wa.me/?text=${mensagem}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ ...styles.page, backgroundImage: `url('./public/fundo.jpg')` }}>
      <div style={styles.overlay} />
      <nav style={styles.navbar}>
        <div style={styles.logo}>💪 Meu Treino AI</div>
      </nav>

      <div style={styles.header}>
        <h2>Preencha os dados abaixo para gerar um treino personalizado com inteligência artificial.</h2>
        <p>O sistema considera seu objetivo, frequência e características físicas para criar um plano ideal. Todos os campos com * são obrigatórios.</p>
      </div>

      <div style={styles.formContainer}>
        <input name="nome" placeholder="Nome *" style={styles.input} onChange={handleChange} />
        <input name="nascimento" placeholder="Data de nascimento *" style={styles.input} onChange={handleChange} />
        <input name="altura" placeholder="Altura *" style={styles.input} onChange={handleChange} />
        <input name="peso" placeholder="Peso *" style={styles.input} onChange={handleChange} />
        <input name="diasTreino" placeholder="Dias de treino por semana *" style={styles.input} onChange={handleChange} />

        <select name="divisao" style={styles.select} onChange={handleChange}>
          <option value="separado">Grupos musculares separados</option>
          <option value="conjunto">Grupos musculares juntos</option>
        </select>

        <select name="objetivo" style={styles.select} onChange={handleChange}>
          <option value="Ganho de massa muscular">Ganho de massa muscular</option>
          <option value="Perda de gordura">Perda de gordura</option>
          <option value="Estética">Estética</option>
          <option value="Lazer">Lazer</option>
          <option value="Condicionamento físico">Condicionamento físico</option>
        </select>

        <button style={styles.button} onClick={gerarTreino} disabled={carregando}>
          {carregando ? 'Gerando treino...' : 'Gerar Treino'}
        </button>
        {erro && <p style={styles.error}>{erro}</p>}
      </div>

      {treino && (
        <div style={styles.result}>
          <h3 style={styles.resultTitle}>📋 Treino Gerado</h3>
          <div style={styles.treinoBox}>{treino}</div>
          <div style={styles.buttonRow}>
            <button style={styles.button} onClick={exportarPdf}>Exportar PDF</button>
            <button style={styles.button} onClick={compartilharWhatsapp}>Compartilhar no WhatsApp</button>
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        © 2025 Meu Treino AI — Desenvolvido por Johnny & Pedro
      </footer>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: 'Arial, sans-serif',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    position: 'relative',
    paddingBottom: '50px'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1,
    backdropFilter: 'blur(6px)'
  },
  navbar: {
    backgroundColor: '#374785',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1
  },
  logo: {
    color: 'white'
  },
  header: {
    padding: '20px',
    textAlign: 'center',
    maxWidth: '700px',
    margin: 'auto',
    color: 'white',
    zIndex: 1
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    maxWidth: '500px',
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 1
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center'
  },
  result: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '20px auto',
    zIndex: 1
  },
  resultTitle: {
    fontSize: '18px',
    marginBottom: '10px'
  },
  treinoBox: {
    backgroundColor: '#f8f8f8',
    padding: '15px',
    borderRadius: '6px',
    whiteSpace: 'pre-line',
    maxHeight: '400px',
    overflowY: 'auto',
    marginBottom: '15px'
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '14px',
    color: '#eee',
    zIndex: 1
  }
};

export default App;
