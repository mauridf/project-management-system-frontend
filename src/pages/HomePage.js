import React, { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Chip, Container } from '@mui/material';
import axios from 'axios';

// Função para determinar o status da tarefa com base no prazo e no status
const getStatusTarefa = (dataEntrega, status) => {
  const hoje = new Date();
  const prazo = new Date(dataEntrega);

  if (status === 'Concluída') {
    // Se a tarefa for concluída e o prazo já passou, consideramos como 'Em dia'
    if (prazo < hoje) {
      return { status: 'Em dia', color: 'success' }; // Verde
    }
    return { status: 'Em dia', color: 'success' }; // Verde, pois está concluída
  }

  // Se o status for 'Pendente' ou 'Em progresso', aplicamos a lógica normal de prazo
  if (prazo < hoje) {
    return { status: 'Atrasado', color: 'error' }; // Vermelho
  } else if (prazo > hoje) {
    return { status: 'Em dia', color: 'success' }; // Verde
  } else {
    return { status: 'No Prazo', color: 'warning' }; // Laranja
  }
};

const getStatusProjeto = (data) => {
  const hoje = new Date();
  const prazo = new Date(data);

  if (prazo < hoje) {
    return { status: 'Atrasado', color: 'error' }; // Vermelho
  } else if (prazo > hoje) {
    return { status: 'Em dia', color: 'success' }; // Verde
  } else {
    return { status: 'No Prazo', color: 'warning' }; // Laranja
  }
};

// Função para formatar a data no formato brasileiro (dd/mm/yyyy)
const formatarData = (data) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(data).toLocaleDateString('pt-BR', options);
};

const HomePage = () => {
  const [projetos, setProjetos] = useState([]);
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    // Buscar Projetos e Tarefas
    axios.get('http://localhost:3000/api/projetos')
      .then((response) => {
        setProjetos(response.data);
      })
      .catch((error) => console.error('Erro ao buscar projetos:', error));

    axios.get('http://localhost:3000/api/tarefas')
      .then((response) => {
        setTarefas(response.data);
      })
      .catch((error) => console.error('Erro ao buscar tarefas:', error));
  }, []);

  // Filtrar tarefas de cada projeto
  const projetosComTarefas = projetos.map((projeto) => {
    const tarefasDoProjeto = tarefas.filter((tarefa) => tarefa.projetoId === projeto.id);
    return {
      ...projeto,
      tarefas: tarefasDoProjeto,
    };
  });

  return (
    <Container sx={{ paddingTop: 3, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {projetosComTarefas.length > 0 ? (
          projetosComTarefas.map((projeto) => (
            <Box key={projeto.id} sx={{ marginBottom: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                {projeto.nome} -{' '}
                {getStatusProjeto(projeto.prazo).status}
                <Chip
                  label={getStatusProjeto(projeto.prazo).status}
                  color={getStatusProjeto(projeto.prazo).color}
                  size="small"
                  sx={{ marginLeft: 1 }}
                />
              </Typography>
              {/* Exibe a data de prazo formatada */}
              <Typography variant="body2" color="textSecondary">
                Prazo: {formatarData(projeto.prazo)}
              </Typography>
              <List>
                {projeto.tarefas.length > 0 ? (
                  projeto.tarefas.map((tarefa) => (
                    <ListItem key={tarefa.id}>
                      <ListItemText
                        primary={tarefa.titulo}
                        secondary={`Status: ${tarefa.status} - Entrega: ${formatarData(tarefa.dataEntrega)}`}
                      />
                      <Chip
                        label={getStatusTarefa(tarefa.dataEntrega, tarefa.status).status}
                        color={getStatusTarefa(tarefa.dataEntrega, tarefa.status).color}
                        size="small"
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Nenhuma tarefa cadastrada.
                  </Typography>
                )}
              </List>
            </Box>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary">
            Ainda não existem Projetos e Tarefas cadastrados
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
