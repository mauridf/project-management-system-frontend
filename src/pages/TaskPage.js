import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, Grid } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import TaskForm from '../pages/TaskForm';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null); // Estado para armazenar a tarefa a ser editada

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, projectsResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/tarefas'),
          axios.get('http://localhost:3000/api/projetos'),
        ]);
        setTasks(tasksResponse.data);
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error('Erro ao carregar tarefas ou projetos', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewTaskClick = () => {
    setTaskToEdit(null); // Resetar a tarefa para garantir que estamos criando uma nova
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tarefas/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Erro ao excluir tarefa', error);
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task); // Passa a tarefa para o formulário
    setShowForm(true); // Mostra o formulário de edição
  };

  // Função para formatar a data no formato brasileiro (dd/mm/yyyy)
  const formatarData = (data) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(data).toLocaleDateString('pt-BR', options);
  };

  // Função para obter o nome do projeto pelo projetoId
  const getProjectNameById = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.nome : 'Projeto não encontrado';
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
      <Typography variant="h5" gutterBottom sx={{ marginTop: '20px' }}>
        Tarefas Cadastradas
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleNewTaskClick}>
          Nova Tarefa
        </Button>
      </Box>

      {showForm && <TaskForm task={taskToEdit} onClose={handleCloseForm} />}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container justifyContent="center" sx={{ width: '100%' }}>
          <Grid item xs={22} md={20} lg={16}>
            <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Data de Entrega</TableCell>
                    <TableCell>Projeto</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.titulo}</TableCell>
                        <TableCell>{task.descricao}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>{formatarData(task.dataEntrega)}</TableCell>
                        <TableCell>{getProjectNameById(task.projetoId)}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleEditTask(task)} startIcon={<Edit />} color="primary">
                            Editar
                          </Button>
                          <Button onClick={() => handleDeleteTask(task.id)} startIcon={<Delete />} color="secondary">
                            Deletar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6}>Nenhuma tarefa cadastrada.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TaskPage;
