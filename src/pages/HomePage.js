import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card, CardContent, CardActions, Chip, Button, Container, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const getStatusTarefa = (dataEntrega, status) => {
  const hoje = new Date();
  const prazo = new Date(dataEntrega);

  if (status === 'Concluída') {
    if (prazo < hoje) {
      return { status: 'Em dia', color: 'success' };
    }
    return { status: 'Em dia', color: 'success' };
  }

  if (prazo < hoje) {
    return { status: 'Atrasado', color: 'error' };
  } else if (prazo > hoje) {
    return { status: 'Em dia', color: 'success' };
  } else {
    return { status: 'No Prazo', color: 'warning' };
  }
};

const getStatusProjeto = (data) => {
  const hoje = new Date();
  const prazo = new Date(data);

  if (prazo < hoje) {
    return { status: 'Atrasado', color: 'error' };
  } else if (prazo > hoje) {
    return { status: 'Em dia', color: 'success' };
  } else {
    return { status: 'No Prazo', color: 'warning' };
  }
};

const formatarData = (data) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(data).toLocaleDateString('pt-BR', options);
};

const HomePage = () => {
  const [projetos, setProjetos] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
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

  const projetosComTarefas = projetos.map((projeto) => {
    const tarefasDoProjeto = tarefas.filter((tarefa) => tarefa.projetoId === projeto.id);
    return {
      ...projeto,
      tarefas: tarefasDoProjeto,
    };
  });

  const projetosPorPagina = 4;
  const totalPaginas = Math.ceil(projetosComTarefas.length / projetosPorPagina);
  const projetosExibidos = projetosComTarefas.slice(0, pagina * projetosPorPagina);

  const handleMostrarMais = () => {
    if (pagina < totalPaginas) {
      setPagina(pagina + 1);
    }
  };

  return (
    <Container sx={{ paddingTop: 3, minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {projetosExibidos.length > 0 ? (
          projetosExibidos.map((projeto) => (
            <Grid item xs={13} sm={7} md={4} key={projeto.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {projeto.nome}
                  </Typography>
                  <Chip
                    label={getStatusProjeto(projeto.prazo).status}
                    color={getStatusProjeto(projeto.prazo).color}
                    size="small"
                    sx={{ marginBottom: 2 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    Prazo: {formatarData(projeto.prazo)}
                  </Typography>
                  <List>
                    {projeto.tarefas.length > 0 ? (
                      projeto.tarefas.map((tarefa) => (
                        <ListItem key={tarefa.id} sx={{ paddingLeft: 0 }}>
                          <ListItemText
                            primary={tarefa.titulo}
                            secondary={`Entrega: ${formatarData(tarefa.dataEntrega)}`}
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
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Ver Detalhes
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary">
            Ainda não existem Projetos e Tarefas cadastrados
          </Typography>
        )}
      </Grid>
      {pagina < totalPaginas && (
        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <Button onClick={handleMostrarMais} variant="contained" color="primary">
            Mostrar mais
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
